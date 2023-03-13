import { Order, Enrollment, Course } from "../../../payload-types"

export type EnrollmentCreateDto = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>

export default function createEnrollmentDto(doc: Order, course: Course['id']): EnrollmentCreateDto {
    
    const enrollmentData: EnrollmentCreateDto = {
        student: doc.customer,
        course: course,
        status: 'active',
        order: doc.id,
    }
    
    return enrollmentData
}   