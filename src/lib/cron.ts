import cron from "node-cron";
import payload from 'payload';
import { PaginatedDocs } from "payload/dist/mongoose/types";
import { Enrollment, Order, Subscription } from "../payload-types";
import tryCatch from "../utilities/tryCatch";
const todayDate = new Date().toISOString().substring(0, 10);

async function findPastDueDateSubscription(): Promise<[PaginatedDocs<Subscription> | null, Error | null]> {
    const [subscriptions, subError] = await tryCatch<PaginatedDocs<Subscription>>(payload.find({
        collection: 'subscriptions',
        where: {
            and: [
                {
                    status: {
                        equals: 'active'
                    },
                },
                {
                    endDate: {
                        less_than: todayDate
                    }
                }
            ]
        }
    }))

    if (subError) {
        console.log(subError, '<----------- subError');
        return [null, subError]
    }

    // console.log(subscriptions, '<----------- subscriptions');
    return [subscriptions, null]
}


async function setAsInactiveSubscription(subscriptions: Subscription[]) {
    let updatedSubs = []
    for (const subscription of subscriptions) {
        const [updatedSubscription, updatedSubscriptionError] = await tryCatch(payload.update({
            collection: 'subscriptions',
            id: subscription.id,
            data: {
                status: 'inactive'
            }
        }))

        if (updatedSubscriptionError) {
            console.log(updatedSubscriptionError, '<----------- updatedSubscriptionError');
            return [null, updatedSubscriptionError]
        }

        // console.log(updatedSubscription, '<----------- updatedSubscription');
        updatedSubs.push(updatedSubscription)
    }

    return [updatedSubs, null]
}

async function setAsInactiveOrder(orders: string[]) {
    let updatedOrders = []
    for (const order of orders) {
        const [updatedOrder, updatedOrderError] = await tryCatch(payload.update({
            collection: 'orders',
            id: order,
            data: {
                status: 'inactive'
            }
        }))

        if (updatedOrderError) {
            console.log(updatedOrderError, '<----------- updatedOrderError');
            return [null, updatedOrderError]
        }

        // console.log(updatedOrder, '<----------- updatedOrder');
        updatedOrders.push(updatedOrder)
    }

    return [updatedOrders, null]
}

async function createRenewalOrder(subscriptions: Subscription[]): Promise<[Order[] | null, Error | null]> {

    const subscriptionOrderIds = subscriptions.map((subscription) => {
        return typeof subscription.order === 'string' ? subscription.order : subscription?.order?.id
    })

    let newOrders = []
    for (const subscription of subscriptions) {

        const userId = typeof subscription.user === 'string' ? subscription.user : subscription?.user?.id
        const productsIds = [typeof subscription.product === 'string' ? subscription.product : subscription?.product?.id]
        console.log(productsIds, '<----------- productsIds');
        const [order, orderError] = await tryCatch(payload.create({
            collection: 'orders',
            data: {
                products: productsIds,
                status: 'pending',
                type: 'renewal',
                customer: userId,
            }
        }))

        if (orderError) {
            console.log(orderError, '<----------- orderError');
            return [null, orderError]
        }

        newOrders.push(order)
    }

    return [newOrders, null]
}

export async function runInactivateSubscriptionAndCreateRenewalOrder() {
    const [subscriptions, subError] = await findPastDueDateSubscription()

    if (subError) {
        return [null, subError]
    }

    const [updatedSubscriptions, updatedSubError] = await setAsInactiveSubscription(subscriptions?.docs as Subscription[])

    if (updatedSubError) {
        return [null, updatedSubError]
    }

    const [inactivatedOrders, inactivatedOrdersError] = await setAsInactiveOrder(subscriptions?.docs.map((subscription) => {
        return typeof subscription.order === 'string' ? subscription.order : subscription?.order?.id
    }) as string[])

    if (inactivatedOrdersError) {
        return [null, inactivatedOrdersError]
    }

    const [newOrders, newOrdersError] = await createRenewalOrder(subscriptions?.docs as Subscription[])

    if (newOrdersError) {
        return [null, newOrdersError]
    }

    // payload.sendEmail({
    //     to: 'arepayquezo@gmail.com',
    //     from: 'noreply@pincelx.com',
    //     subject: 'Subscription Renewal',
    //     html: 'Your subscription has been renewed'
    // })

    console.log("Finished running inactivate subscription and create renewal order");

    return [newOrders, null]
}

export const cronJob = () => {
    cron.schedule('0 1 * * *', () => {
        console.log('Running a task every midnight (1:00 am)')
        runInactivateSubscriptionAndCreateRenewalOrder().then((result) => {
            console.log(result, '<----------- result');
        }).catch((error) => {
            console.log(error, '<----------- error');
        })
    })
}