import { Access } from "payload/config"
import { checkRole } from "../collections/Users/checkRole"
import { User } from "../payload-types"

const hasAccessOrIsEnrolled= ({ req: { user, payload }, id }: { req: { user: User, payload: any }, id?: string | number }, type: string): boolean | Promise<boolean> => {

    if (!user) {
        return false;
    }

    if (checkRole(['admin', 'teacher'], user as unknown as User)) {
        return true;
    }

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
                        {
                            [`course.${type}`]: {
                                in: [id],
                            },
                        },
                    ],
                },
            });

            if (!enrollment || enrollment.docs.length === 0) {
                return false;
            }

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    return findIfUserIsEnrolled();
};

export default hasAccessOrIsEnrolled