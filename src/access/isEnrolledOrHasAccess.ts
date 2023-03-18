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
    payload.find({
        collection: 'enrollments',
        where: {
            and: [
                {
                    student: {
                        equals: user.id,
                    },
                },
                {
                    status: {
                        equals: 'active',
                    },
                },
            ],
        }
    }).then((enrollment) => {
        // return enrollment ? true : false
       return {
            and: [
                {
                    student: {
                        equals: user.id,
                    },
                },
                {
                    status: {
                        equals: 'active',
                    },
                },
            ],
        }
    }).catch((err) => {
        console.log(err)
        return false
    })
    return false
}