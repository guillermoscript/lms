import { Course, Enrollment, Order, Plan, Product, Subscription, User } from '../../../payload-types';
import { Payload } from "payload";
import createEnrollmentDto, { EnrollmentCreateDto } from '../dto/createEnrollmentDto';
import createSubscriptionDto, { SubscriptionCreateDto } from '../dto/createSubscriptionDto';
import { FieldHook } from 'payload/types';
import { Message } from 'payload/dist/email/types';
import tryCatch from '../../../utilities/tryCatch';
import { PaginatedDocs } from 'payload/dist/mongoose/types';
import { noReplyEmail } from '../../../utilities/consts';


const createOrderAbleAfterChange: FieldHook = async ({
    req,
    originalDoc,
}) => {
    const docType: Order = originalDoc
    const status = docType.status
    const type = docType.type

    if (status === 'inactive' || status === 'pending' || status === 'canceled' || status === 'finished' || status === 'refunded') {
        return
    }

    if (type === "order") {
        return
    }

    // TODO if an order is type enrrollment, and status changes to inactive, then set enrollment to inactive

    const typeOfOrder = docType?.products?.map(product => {
        if (typeof product === 'string') {
            return product
        } else {
            return product.id
        }
    })

    const [purchasedProducts, purchasedProductsError] = await tryCatch<PaginatedDocs<Product>>(req.payload.find({
        collection: 'products',
        where: {
            id: {
                in: typeOfOrder,
            }
        }
    }))

    if (purchasedProductsError) {
        return
    }

    const products = purchasedProducts?.docs

    console.log(products, '<----------- products')

    async function subscription() {
        console.log('subscription')
        const productThatArePlans = products?.filter(product => product.productType?.relationTo === 'plans');
        if (productThatArePlans?.length === 0) {
            console.log('no plans');
            await sendUserEmail(docType.customer, req.payload);
            return;
        }

        const plansIds = productThatArePlans?.map(product => {
            return product.productType?.value as Plan;
        });

        const [plans, plansError] = await tryCatch<PaginatedDocs<Plan>>(req.payload.find({
            collection: 'plans',
            where: {
                id: {
                    in: plansIds?.map(plan => plan.id as string),
                }
            }
        }));

        if (plansError) {
            return;
        }

        const [subscription, errorSub] = await newCreateSubscription(plans?.docs as Plan[], req.payload, docType, productThatArePlans as Product[]);

        if (errorSub) {
            return;
        }

        // now create an enrollment for each course in the plan
        const courses = plans?.docs.map(plan => {
            return plan.courses as Course[];
        }).flat();

        console.log(courses, '<----------- courses')

        const createdEnrollments: Enrollment[] = []
        let error: Error | null = null
        for (const course of (courses as Course[])) {

            const [enrollmentDoc, enrollmentError] = await tryCatch<Enrollment>(req.payload.create({
                collection: 'enrollments',
                data: {
                    student: docType.customer,
                    products: (products as Product[])[0].id,
                    course: course.id,
                    status: 'active',
                    order: docType.id,
                }
            }))

            if (enrollmentError) {
                error = enrollmentError
                break
            }

            createdEnrollments.push(enrollmentDoc as Enrollment)
        }

        if (error) {
            console.log(error, '<----------- error')
            return
        }

        console.log(createdEnrollments, '<----------- createdEnrollments')


        await sendUserEmail(docType.customer, req.payload);
        return true;
    }

    const typeOfOrderFlowToTake = {
        async enrollment() {

            console.log('enrollment')
            const productThatAreCoruse = products?.filter(product => product?.productType?.relationTo === 'courses');
            const coursesIds = productThatAreCoruse?.map(product => {
                return product.productType?.value as Course;
            });

            const [courses, coursesError] = await tryCatch<PaginatedDocs<Course>>(req.payload.find({
                collection: 'courses',
                where: {
                    id: {
                        in: coursesIds?.map(course => course.id as string),
                    }
                }
            }));

            if (coursesError) {
                return;
            }

            const [enrollment, errorEnrollment] = await newCreateEnrollment(courses?.docs as Course[], req.payload, docType, productThatAreCoruse as Product[]);

            if (errorEnrollment) {
                return;
            }

            await sendUserEmail(docType.customer, req.payload);
            return true;
        },
        subscription: subscription,
        renewal: subscription,
    }

    if (typeOfOrderFlowToTake[type as keyof typeof typeOfOrderFlowToTake]) {
        await typeOfOrderFlowToTake[type as keyof typeof typeOfOrderFlowToTake]()
    }

    return
}

async function sendUserEmail(userId: Order['customer'], payload: Payload) {
    
    const [user, userError] = await tryCatch<User>(payload.findByID({
        collection: 'users',
        id: userId as string,
    }))

    if (userError) return

    const mailOptions: Message = {
        from: noReplyEmail,
        to: user?.email as string,
        subject: 'Su compra ha sido exitosa',
        html: `<h1>Gracias por comprar</h1>`,
    };
    payload.sendEmail(mailOptions)
}

async function newCreateSubscription(plans: Plan[], payload: Payload, docType: Order, productThatArePlans: Product[]) {
    
    const subscriptionData = productThatArePlans.map((product,index) => {
        const planId = plans[index].id as string
        const planPeriodicity = plans[index].periodicity
        return createSubscriptionDto(docType, product, planId, planPeriodicity)
    })
    
    let subscriptions: Subscription[] = []
    let error: Error[] = []

    for (const subscription of subscriptionData) {
        const [subscriptionDoc, subscriptionError] = await tryCatch<Subscription>(payload.create({
            collection: 'subscriptions',
            data: subscription as SubscriptionCreateDto,
        }))

        if (subscriptionError) {
            console.error(subscriptionError)
            error.push(subscriptionError)
            break
        }

        subscriptions.push(subscriptionDoc as Subscription)
    }

    return error.length > 0 ? [null, error] : [subscriptions, null]
}

async function newCreateEnrollment(courses: Course[], payload: Payload, docType: Order, productThatAreCourses: Product[]) {

    const userId = typeof docType.customer === 'string' ? docType.customer : docType?.customer?.id
    const enrollmentData = productThatAreCourses.map((product,index) => {
        const courseId = courses[index].id as string
        return createEnrollmentDto({
            orderId: docType.id as string,
            studentId: userId as string,
            course: courseId,
            productId: product.id as string,
        })
    })

    const createdEnrollments: Enrollment[] = []
    let error: Error | null = null

    for (const enrollment of enrollmentData) {
        const [enrollmentDoc, enrollmentError] = await tryCatch<Enrollment>(payload.create({
            collection: 'enrollments',
            data: enrollment,
        }))

        if (enrollmentError) {
            console.error(enrollmentError)
            error = enrollmentError
            break
        }
        createdEnrollments.push(enrollmentDoc as Enrollment)
    }

    return error ? [null, error] : [createdEnrollments, null]
}

export default createOrderAbleAfterChange