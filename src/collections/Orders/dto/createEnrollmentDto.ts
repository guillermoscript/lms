import { Order, Enrollment, Course, Product, User } from "../../../payload-types"

export type EnrollmentCreateDto = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>

type CreateEnrollemntType = {
    course: Course['id']
    productId: Product['id']
    orderId: Order['id']
    studentId: User['id']
}

export default function createEnrollmentDto({
    course,
    productId,
    orderId,
    studentId
}: CreateEnrollemntType): EnrollmentCreateDto {

    const enrollmentData: EnrollmentCreateDto = {
        student: studentId,
        course: course,
        status: 'active',
        order: orderId,
        products: productId
    }

    return enrollmentData
}   