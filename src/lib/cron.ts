import cron from "node-cron";
import payload from 'payload';
import { PaginatedDocs } from "payload/dist/mongoose/types";
import { Order, Subscription } from "../payload-types";
import tryCatch from "../utilities/tryCatch";
const todayDate = new Date().toISOString().substring(0, 10);

async function findPastDueDateSubscription(): Promise<[PaginatedDocs<Subscription> | null, Error | null]> {
    const [subscriptions, subError]: [PaginatedDocs<Subscription>, Error] = await tryCatch(payload.find({
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

async function setAsInactiveEnrollment(subscriptions: Subscription[]) {
    let updatedEnrollments = []
    const enrollmentIds = subscriptions.map((subscription) => {
        return typeof subscription.enrollment === 'string' ? subscription.enrollment : subscription.enrollment.id
    })

    for (const enrollmentId of enrollmentIds) {
        const [updatedEnrollment, updatedEnrollmentError] = await tryCatch(payload.update({
            collection: 'enrollments',
            id: enrollmentId,
            data: {
                status: 'inactive'
            }
        }))
        if (updatedEnrollmentError) {
            console.log(updatedEnrollmentError, '<----------- updatedEnrollmentError');
            return [null, updatedEnrollmentError]
        }

        // console.log(updatedEnrollment, '<----------- updatedEnrollment');
        updatedEnrollments.push(updatedEnrollment)
    }

    return [updatedEnrollments, null]
}

async function createRenewalOrder(subscriptions: Subscription[]) {

    const subscriptionOrderIds = subscriptions.map((subscription) => {
        return typeof subscription.order === 'string' ? subscription.order : subscription.order.id
    })

    console.log(subscriptionOrderIds, '<----------- subscriptionIds');
    const [orders, ordersError] = await tryCatch(payload.find({
        collection: 'orders',
        where: {
            id: {
                in: subscriptionOrderIds
            }
        }
    }))

    if (ordersError) {
        console.log(ordersError, '<----------- ordersError');
        return [null, ordersError]
    }

    // only get unique order
    const uniqueOrderIds = [...new Set(orders.docs)]

    console.log(uniqueOrderIds, '<----------- uniqueOrderIds');

    let newOrders = []
    for (const order of uniqueOrderIds) {

        const products = order.products.map((product) => {
            return product.id
        })

        const [newOrder, newOrderError] = await tryCatch(payload.create({
            collection: 'orders',
            data: {
                customer: order.customer.id,
                products: products,
                status: 'inactive',
                // orderType: 'renewal'
            }
        }))

        if (newOrderError) {
            console.log(newOrderError, '<----------- updatedOrderError');
            return [null, newOrderError]
        }

        newOrders.push(newOrder)
    }

    return [newOrders, null]
}

export async function runInactivateSubscriptionAndCreateRenewalOrder() {
    const [subscriptions, subError] = await findPastDueDateSubscription()

    if (subError) {
        return [null, subError]
    }

    const [updatedSubscriptions, updatedSubError] = await setAsInactiveSubscription(subscriptions.docs)

    if (updatedSubError) {
        return [null, updatedSubError]
    }

    const [updatedEnrollments, updatedEnrollmentsError] = await setAsInactiveEnrollment(subscriptions.docs)

    if (updatedEnrollmentsError) {
        return [null, updatedEnrollmentsError]
    }


    const [newOrders, newOrdersError] = await createRenewalOrder(subscriptions.docs)

    if (newOrdersError) {
        return [null, newOrdersError]
    }

    payload.sendEmail({
        to: 'arepayquezo@gmail.com',
        from: 'noreply@pincelx.com',
        subject: 'Subscription Renewal',
        html: 'Your subscription has been renewed'
    })

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