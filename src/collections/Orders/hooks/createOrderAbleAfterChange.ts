import { Course, Enrollment, Order, Plan, Product, Subscription, User } from '../../../payload-types';
import { Payload } from "payload";
import createEnrollmentDto, { EnrollmentCreateDto } from '../dto/createEnrollmentDto';
import createSubscriptionDto, { SubscriptionCreateDto } from '../dto/createSubscriptionDto';
import { FieldHook } from 'payload/types';
import { Message } from 'payload/dist/email/types';
import tryCatch from '../../../utilities/tryCatch';
import { PaginatedDocs } from 'payload/dist/mongoose/types';

const createOrderAbleAfterChange: FieldHook = async ({
    req,
    originalDoc,
}) => {
    const docType: Order = originalDoc
    const status = docType.status
    const type = docType.type

    if (status === 'inactive') {
        return
    }

    if (type === "renewal") {
        return
    }

    const typeOfOrder = docType.products.map(product => {
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

    const products = purchasedProducts.docs

    console.log(products, '<----------- products')
    
    const typeOfOrderFlowToTake = {
        async enrollment() {

            console.log('enrollment')
            const productThatAreCoruse = products.filter(product => product.productType.relationTo === 'courses');
            const coursesIds = productThatAreCoruse.map(product => {
                return product.productType.value as Course;
            });

            const [courses, coursesError] = await tryCatch<PaginatedDocs<Course>>(req.payload.find({
                collection: 'courses',
                where: {
                    id: {
                        in: coursesIds.map(course => course.id as string),
                    }
                }
            }));

            if (coursesError) {
                return;
            }

            const [enrollment, errorEnrollment] = await newCreateEnrollment(courses.docs, req.payload, docType, productThatAreCoruse);

            if (errorEnrollment) {
                return;
            }

            await sendUserEmail(docType.customer, req.payload);
            return true;
        },
        async subscription() {
            console.log('subscription')
            const productThatArePlans = products.filter(product => product.productType.relationTo === 'plans');
            if (productThatArePlans.length === 0) {
                console.log('no plans');
                await sendUserEmail(docType.customer, req.payload);
                return;
            }

            const plansIds = productThatArePlans.map(product => {
                return product.productType.value as Plan;
            });

            const [plans, plansError] = await tryCatch<PaginatedDocs<Plan>>(req.payload.find({
                collection: 'plans',
                where: {
                    id: {
                        in: plansIds.map(plan => plan.id as string),
                    }
                }
            }));

            if (plansError) {
                return;
            }

            const [subscription, errorSub] = await newCreateSubscription(plans.docs, req.payload, docType, productThatArePlans);

            if (errorSub) {
                return;
            }

            await sendUserEmail(docType.customer, req.payload);
            return true;
        },
    }

    if (typeOfOrderFlowToTake[type]) {
        await typeOfOrderFlowToTake[type]()
    }

    return
}

async function sendUserEmail(userId: Order['customer'], payload: Payload) {
    console.log(userId, '<----------- userId');
    const [user, userError] = await tryCatch<User>(payload.findByID({
        collection: 'users',
        id: userId as string,
    }))

    if (userError) return

    const mailOptions: Message = {
        from: 'noreply@pincelx.com',
        to: user.email as string,
        subject: 'Su compra ha sido exitosa',
        html: `<h1>Gracias por comprar</h1>`,
    };
    payload.sendEmail(mailOptions)
}

async function newCreateSubscription(plans: Plan[], payload: Payload, docType: Order, productThatArePlans: Product[]): Promise<[Subscription[], Error]> {
    
    const subscriptionData = productThatArePlans.map((product,index) => {
        const planId = plans[index].id as string
        const planPeriodicity = plans[index].periodicity
        return createSubscriptionDto(docType, product, planId, planPeriodicity)
    })
    
    let subscriptions: Subscription[] = []
    let error: Error = null

    for (const subscription of subscriptionData) {
        const [subscriptionDoc, subscriptionError] = await tryCatch<Subscription>(payload.create({
            collection: 'subscriptions',
            data: subscription,
        }))

        if (subscriptionError) {
            console.error(subscriptionError)
            error = subscriptionError
            break
        }

        subscriptions.push(subscriptionDoc)
    }

    return error ? [null, error] : [subscriptions, null]
}

async function newCreateEnrollment(courses: Course[], payload: Payload, docType: Order, productThatAreCourses: Product[]): Promise<[Enrollment[], Error]> {

    const userId = typeof docType.customer === 'string' ? docType.customer : docType.customer.id
    const enrollmentData = productThatAreCourses.map((product,index) => {
        const courseId = courses[index].id as string
        return createEnrollmentDto({
            orderId: docType.id as string,
            studentId: userId,
            course: courseId,
            productId: product.id as string,
        })
    })

    const createdEnrollments: Enrollment[] = []
    let error: Error = null

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
        createdEnrollments.push(enrollmentDoc)
    }

    return error ? [null, error] : [createdEnrollments, null]
}

export default createOrderAbleAfterChange