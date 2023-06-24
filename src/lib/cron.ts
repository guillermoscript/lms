import cron from "node-cron";
import payload from 'payload';
import { PaginatedDocs } from "payload/dist/mongoose/types";
import { Enrollment, Order, Subscription, User } from "../payload-types";
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

async function findEnrollemntsFromOrder(orderIds: string[]): Promise<[PaginatedDocs<Enrollment> | null, Error | null]> {
    const [enrollments, enrollmentsError] = await tryCatch<PaginatedDocs<Enrollment>>(payload.find({
        collection: 'enrollments',
        where: {
            order: {
                in: orderIds
            }
        }
    }))

    if (enrollmentsError) {
        console.log(enrollmentsError, '<----------- enrollmentsError');
        return [null, enrollmentsError]
    }

    // console.log(enrollments, '<----------- enrollments');
    return [enrollments, null]
}

async function setAsInactiveSubscription(subscriptions: Subscription[]) {
    let updatedSubs = []
    for (const subscription of subscriptions) {
        const [updatedSubscription, updatedSubscriptionError] = await tryCatch<Subscription>(payload.update({
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

async function setAsInactiveEnrollment(enrollments: Enrollment[]) {
    let updatedEnrollments = []
    for (const enrollment of enrollments) {
        const [updatedEnrollment, updatedEnrollmentError] = await tryCatch<Enrollment>(payload.update({
            collection: 'enrollments',
            id: enrollment.id,
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

async function setAsInactiveOrder(orders: string[]) {
    let updatedOrders = []
    for (const order of orders) {
        const [updatedOrder, updatedOrderError] = await tryCatch<Order>(payload.update({
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

    return [updatedOrders as Order[], null]
}

// TODO que pasa si la persona paga antes? no se deberia crear una nueva orden
async function createRenewalOrder(orders: Order[]): Promise<[Order[] | null, Error | null]> {


    let newOrders = []
    for (const myorder of orders) {

        const userId = myorder.customer === 'string' ? myorder.customer : (myorder?.customer as User)?.id
        const productsIds = (myorder.products as any[]).map((product) => {
            return typeof product === 'string' ? product : product?.id
        })
        console.log(productsIds, '<----------- productsIds');
        const [order, orderError] = await tryCatch(payload.create({
            collection: 'orders',
            data: {
                products: productsIds,
                status: 'pending',
                type: 'renewal',
                customer: userId,
                amount: myorder.amount,
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

    const ordersIds = subscriptions?.docs.map((subscription) => {
        return typeof subscription.order === 'string' ? subscription.order : subscription?.order?.id
    })

    const [inactivatedOrders, inactivatedOrdersError] = await setAsInactiveOrder(ordersIds as string[])

    if (inactivatedOrdersError) {
        return [null, inactivatedOrdersError]
    }

    const [enrollments, enrollmentsError] = await findEnrollemntsFromOrder(ordersIds as string[])

    if (enrollmentsError) {
        return [null, enrollmentsError]
    }

    const [updatedEnrollments, updatedEnrollmentsError] = await setAsInactiveEnrollment(enrollments?.docs as Enrollment[])

    console.log(updatedEnrollments, '<----------- updatedEnrollments')

    if (updatedEnrollmentsError) {
        return [null, updatedEnrollmentsError]
    }

    const uniqueInactiveOrder = [...new Set(inactivatedOrders as Order[])]

    const [newOrders, newOrdersError] = await createRenewalOrder(uniqueInactiveOrder)

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