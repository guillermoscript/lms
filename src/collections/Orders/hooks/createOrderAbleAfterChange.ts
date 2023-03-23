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
    const type = docType.type
    if (status === 'inactive') {
        return
    }

    if (type === "renewal" || type === "order") {
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
    const productThatArePlans = products.filter(product => product.productType.relationTo === 'plans')
    const plansIds = productThatArePlans.map(product => {
        return product.productType.value as Plan
    })

    const [plans, plansError] = await tryCatch<PaginatedDocs<Plan>>(req.payload.find({
        collection: 'plans',
        where: {
            id: {
                in: plansIds.map(plan => plan.id as string),
            }
        }
    }))

    if (plansError) {
        return
    }

    if (productThatArePlans.length === 0) {
        console.log('no plans');
        await sendUserEmail(docType.customer, req.payload)
        return
    }

    const [subscription, errorSub] = await newCreateSubscription(plans.docs, req.payload, docType, productThatArePlans)

    if (errorSub) {
        return
    }
    
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

    return [subscriptions, null]
}

export default createOrderAbleAfterChange