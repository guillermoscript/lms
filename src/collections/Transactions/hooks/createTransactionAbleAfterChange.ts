import { Enrollment, Transaction, Subscription } from '../../../payload-types';
import { Payload } from "payload";
import createEnrollmentDto, { EnrollmentCreateDto } from '../dto/createEnrollmentDto';
import createSubscriptionDto, {SubscriptionCreateDto} from '../dto/createSubscriptionDto';
import { FieldHook } from 'payload/types';

const createTransactionAbleAfterChange: FieldHook = async ({
    req,
    originalDoc,
}) => {
    const docType: Transaction = originalDoc
    const status = docType.status

    if (status === 'inactive') {
        return
    }

    const stateMachine: Record<Transaction['transactionAble']['relationTo'], () => Promise<Enrollment | Subscription>> = {
        'enrollments': async () => {

            const subscriptionData = createSubscriptionDto(docType)
            const [subscription, subscriptionError] = await createSubscription(subscriptionData, req.payload)

            if (subscriptionError) {
                console.log(subscriptionError)
                return
            }

            return subscription
            
        },
        'courses': async () => {
            const enrollmentData = createEnrollmentDto(docType)
            const [enrollment, enrollmentError] = await createEnrollment(enrollmentData, req.payload)
            
            if (enrollmentError) {
                console.log(enrollmentError)
                return
            }

            const subscriptionData = createSubscriptionDto(docType, enrollment.id)
            const [subscription, subscriptionError] = await createSubscription(subscriptionData, req.payload)

            if (subscriptionError) {
                console.log(subscriptionError)
                return
            }
            
            return enrollment
        }
    }

    const typeOfTransaction = docType.transactionAble.relationTo
    const createDoc = stateMachine[typeOfTransaction]()

    console.log(await createDoc, '<----------- LOOOOOOOOOOOOOOOOOOOOOOOOOOOK');
}

async function createEnrollment(enrollmentData: EnrollmentCreateDto, payload: Payload): Promise<[Enrollment, Error]> {
    try {
        const enrollment: Enrollment = await payload.create({
            collection: 'enrollments',
            data: enrollmentData,
        })
    
        return [enrollment, null]
    } catch (error) {
        const er = error as Error
        return [null, error]
    }
}

async function createSubscription(subscriptionData: SubscriptionCreateDto,  payload: Payload): Promise<[Subscription, Error]> {
    try {
        const subscription: Subscription = await payload.create({
            collection: 'subscriptions',
            data: subscriptionData,
        })

        return [subscription, null]
    } catch (error) {
        const er = error as Error
        console.log(error)
        return [null, error]
    }
}

export default createTransactionAbleAfterChange