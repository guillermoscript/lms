import { Access } from "payload/config";
import { checkRole } from "./checkRole";
import { User } from "../payload-types";

export const hasAccessOrIsSelf: Access<any, User> = async ({ req: { user, payload } }) => {
    if (!user) return false

    if (checkRole(['admin', 'editor'], user as unknown as User)) return true

    return {
        users: {
            in: [user.id]
        }
    }
}
