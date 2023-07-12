import payload from "payload";
import { Access } from "payload/config";
import { checkRole } from "../collections/Users/checkRole";
import { User } from "../payload-types";

export const isEnrolledOrHasAccess = (roles: User['roles'] = [], user?: User) => {
    // This code checks to see if the user has the role of admin or teacher, and if they do it returns true. 
    // If they don't have those roles, it checks to see if the user is enrolled in a course, and if they are it returns true. 
    // If they aren't enrolled in a course it returns false. 

    if (!user) {
        return false
    }

    if (checkRole(roles, user)) {
        return true
    }

    console.log(user, "user")
    async function findIfUserIsEnrolled() {
        try {
            const enrollment = await payload.find({
                collection: 'enrollments',
                where: {
                    and: [
                        {
                            student: {
                                equals: user?.id,
                            },
                        },
                        {
                            status: {
                                equals: 'active',
                            },
                        },
                    ],
                }
            })

            console.log(enrollment, "enrollment")

             // return enrollment ? true : false
            if (!enrollment || enrollment.docs.length === 0) {
                return false
            }

            const userCourses = enrollment.docs.map((enrollment) => enrollment.course)

            console.log(userCourses, "userCourses")

            const arrayOfCourseIds = userCourses.map((course) => course.id)
            return {
                id: {
                    in: arrayOfCourseIds,
                }
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return findIfUserIsEnrolled()
}