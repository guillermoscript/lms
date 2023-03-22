import { Subscription, Order } from "../../../payload-types"

export type SubscriptionCreateDto = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>

export default function createSubscriptionDto(doc: Order, enrollmentId?: string, periodicity: SubscriptionCreateDto['periodicity'] = 'monthly'): SubscriptionCreateDto {

    const periodicityStates: Record<SubscriptionCreateDto['periodicity'], number> = {
        'monthly': 1,
        'bimonthly': 2,
        'quarterly': 3,
        'biannual': 6,
        'annual': 12,
        'custom': 0,
    }

    const setDates = (periodicity: SubscriptionCreateDto['periodicity']) => {
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

    const [startDate, endDate] = setDates(periodicity)

    const subscriptionData: SubscriptionCreateDto = {
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        order: doc.id,
        periodicity: periodicity,
        enrollment: enrollmentId,
    }

    return subscriptionData
}