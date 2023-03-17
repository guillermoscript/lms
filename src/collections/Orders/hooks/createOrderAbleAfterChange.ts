import { Enrollment, Order, Plan, Product, Subscription, User } from '../../../payload-types';
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

    if (status === 'inactive') {
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
        console.log(purchasedProductsError)
        return
    }

    const products = purchasedProducts.docs
    const productThatArePlans = products.filter(product => product.productType.relationTo === 'plans')
    const plansIds = productThatArePlans.map(product => {
        return product.productType.value as Plan
    })

    console.log(plansIds, '<----------- plansIds');

    if (productThatArePlans.length === 0) {
        console.log('no plans');
        await sendUserEmail(docType.customer, req.payload)
        return
    }

    const subscription = await createSubscriptonAndEnrollment(plansIds.map(plan => plan.id as string), req.payload, docType)

    await sendUserEmail(docType.customer, req.payload)
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
async function createEnrollment(enrollments: EnrollmentCreateDto[], payload: Payload): Promise<[Enrollment[], Error]> {

    const createdEnrollments: Enrollment[] = []
    for (const enrollment of enrollments) {
        const [enrollmentDoc, enrollmentError] = await tryCatch<Enrollment>(payload.create({
            collection: 'enrollments',
            data: enrollment,
        }))

        if (enrollmentError) {
            return [null, enrollmentError]
        }
        createdEnrollments.push(enrollmentDoc)
    }

    return [createdEnrollments, null]
}

async function createSubscriptonAndEnrollment(plansIds: string[], payload: Payload, docType: Order): Promise<[Subscription[], Error]> {
    const [plans, plansError] = await tryCatch<PaginatedDocs<Plan>>(payload.find({
        collection: 'plans',
        where: {
            id: {
                in: plansIds,
            }
        }
    }))

    console.log(plans, '<----------- plans');

    if (plansError) {
        console.log(plansError)
        return [null, plansError]
    }

    // we need to create an enrollment for each course in each plan, so we iterate over the plans and then over the courses in each plan, creating a dto for each course
    const coursesToEnroll = plans.docs.map(plan => {
        const coursesToEnroll = plan.courses.map(course => {
            if (typeof course === 'string') {
                return createEnrollmentDto(docType, course)
            } else {
                return createEnrollmentDto(docType, course.id)
            }
        })
        return coursesToEnroll
    })

    // we need to flatten the array of arrays of enrollment dtos into a single array of enrollment dtos, because the createEnrollment function expects an array of enrollment dtos
    const enrollmentData = coursesToEnroll.flat()

    console.log(enrollmentData, '<----------- enrollmentData');

    const [enrollments, enrollmentError] = await createEnrollment(enrollmentData, payload)

    if (enrollmentError) {
        console.log(enrollmentError)
        return [null, enrollmentError]
    }

    console.log(enrollments, '<----------- enrollments');

    // const subscriptionData = createSubscriptionDto(docType, enrollment.id)
    const subscriptionData = enrollments.map(enrollment => {
        const subscriptionData = createSubscriptionDto(docType, enrollment.id)
        return subscriptionData
    })
    const [subscriptions, subscriptionError] = await createSubscription(subscriptionData, payload)

    if (subscriptionError) {
        console.log(subscriptionError)
        return
    }

    console.log(subscriptions, '<----------- subscriptions');
    return [subscriptions, null]
}

async function createSubscription(subscriptionData: SubscriptionCreateDto[], payload: Payload): Promise<[Subscription[], Error]> {

    const createdSubscriptions: Subscription[] = []
    for (const subscription of subscriptionData) {
        const [subscriptionDoc, subscriptionError] = await tryCatch<Subscription>(payload.create({
            collection: 'subscriptions',
            data: subscription,
        }))

        if (subscriptionError) {
            return [null, subscriptionError]
        }
        createdSubscriptions.push(subscriptionDoc)
    }

    return [createdSubscriptions, null]
}

export default createOrderAbleAfterChange