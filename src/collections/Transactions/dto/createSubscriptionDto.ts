import { Transaction, Subscription, Enrollment } from "../../../payload-types"

export type SubscriptionCreateDto = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>

export default function createSubscriptionDto(doc: Transaction, enrollmentId?: string): SubscriptionCreateDto {

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

    const [startDate, endDate] = setDates(doc.periodicity)

    const enrollment = enrollmentId ? enrollmentId : doc.transactionAble.value as Enrollment

    const subscriptionData: SubscriptionCreateDto = {
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        transaction: doc.id,
        periodicity: doc.periodicity,
        enrollment: enrollment,
    }
    return subscriptionData
}