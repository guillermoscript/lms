import { Transaction, Enrollment, Course } from "../../../payload-types"

export type EnrollmentCreateDto = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>

export default function createEnrollmentDto(doc: Transaction) {
    
    const enrollmentData: EnrollmentCreateDto = {
        student: doc.customer,
        course: doc.transactionAble.value as Course,
        status: 'active',
        isSubscription: doc.isSubscription,
        transaction: doc.id,
    }
    
    return enrollmentData
}   