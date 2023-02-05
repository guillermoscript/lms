import { Access, FieldAccess } from "payload/types";
import { User } from "../payload-types";

interface RoleAccess {
    user: User
    role: User['roles'][0]
}

export const isRole = ({ user , role }: RoleAccess) => {
    // Return true or false based on if the user has an admin role
    return Boolean(user?.roles?.includes(role));
}

export const isAdminFieldLevel = ({ user , role }: RoleAccess) => {
    // Return true or false based on if the user has an admin role
    return Boolean(user?.roles?.includes(role));
}