import { CollectionAfterChangeHook } from 'payload/types';
import { Enrollment, Transaction, Subscription, Course } from '../../../payload-types';
import { Payload } from "payload";
import createEnrollmentDto, { EnrollmentCreateDto } from '../dto/createEnrollmentDto';
import createSubscriptionDto, {SubscriptionCreateDto} from '../dto/createSubscriptionDto';

const afterChangeHook: CollectionAfterChangeHook = async ({
    doc, // full document data
    req, // full express request
    previousDoc, // document data before updating the collection
    operation, // name of the operation ie. 'create', 'update'
}) => {
    const docType: Transaction = doc
    const status = docType.status

    const stateMachine: Record<Transaction['transactionAble']['relationTo'], () => Promise<Enrollment | Subscription>> = {
        'subscriptions': async () => {
            const subscriptionData = createSubscriptionDto(docType)
            const [subscription, subscriptionError] = await createSubscription(subscriptionData, req.payload)

            if (subscriptionError) {
                console.log(subscriptionError)
            }

            return subscription
            
        },
        'courses': async () => {
            const enrollmentData = createEnrollmentDto(docType)
            const [enrollment, enrollmentError] = await createEnrollment(enrollmentData, req.payload)

            if (enrollmentError) {
                console.log(enrollmentError)
            }

            return enrollment
        }
    }

    const typeOfTransaction = docType.transactionAble.relationTo

    const createDoc = stateMachine[typeOfTransaction]()

    // return createDoc
}

async function createEnrollment(enrollmentData: EnrollmentCreateDto, payload: Payload) {
    try {
        const enrollment = await payload.create({
            collection: 'enrollments',
            data: enrollmentData,
        })
    
        return [enrollment, null]
    } catch (error) {
        console.log(error)
        return [null, error]
    }
}

async function createSubscription(subscriptionData: SubscriptionCreateDto,  payload: Payload) {
    try {
        const subscription = await payload.create({
            collection: 'subscriptions',
            data: subscriptionData,
        })

        return [subscription, null]
    } catch (error) {
        console.log(error)
        return [null, error]
    }
}
