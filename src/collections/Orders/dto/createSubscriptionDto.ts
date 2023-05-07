import { Subscription, Order, Product, Plan } from "../../../payload-types"

export type SubscriptionCreateDto = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>

type periodicity = 'monthly' | 'bimonthly' | 'quarterly' | 'biannual' | 'annual' | 'custom'

export default function createSubscriptionDto(doc: Order, product: Product, plan: Plan['id'], periodicity: SubscriptionCreateDto['periodicity'] = 'monthly') {

    const periodicityStates: Record<periodicity, number> = {
        'monthly': 1,
        'bimonthly': 2,
        'quarterly': 3,
        'biannual': 6,
        'annual': 12,
        'custom': 0,
    }

    const setDates = (periodicity: periodicity): [Date, Date] => {
        const startDate = new Date()
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + periodicityStates[periodicity])

        return [startDate, endDate]
    }

    // ** not sure if custom periodicity is needed
    // TODO: Handle custom periodicity
    if (periodicity === 'custom') {
        return
    }

    const userId = typeof doc.customer === 'string' ? doc.customer : doc?.customer?.id

    const [startDate, endDate] = setDates(periodicity)

    const subscriptionData: SubscriptionCreateDto = {
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        user: userId,
        order: doc.id,
        periodicity: periodicity,
        plan: plan,
        product: product.id,
    }

    return subscriptionData
}