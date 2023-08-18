import { Access } from "payload/config"
import { checkRole } from "../collections/Users/checkRole"
import { User } from "../payload-types"

const hasAccessOrIsEnrolled = async ({ req: { user, payload }, id }: { req: { user: User, payload: any }, id?: string | number }, type: string) => {

    if (!user) {
        return false;
    }

    if (checkRole(['admin', 'teacher'], user as unknown as User)) {
        return true;
    }

    if (id) {

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

            console.log('its true333', enrollment.docs[0]);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    } else {
        // leave it true because of comment in docs
        // If you use id or data within your access control functions, make sure to check that they are defined first.
        // If they are not, then you can assume that your access control is being executed via the access operation, to determine solely what the user can do within the Admin UI.

        // and becuase i restric access to the collection in the admin config
        // i can do this 
        return true
    }
};

export default hasAccessOrIsEnrolled