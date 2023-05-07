import { Access, FieldAccess } from "payload/types";
import { User } from "../payload-types";

interface RoleAccess {
    user: User
    role: ('admin' | 'teacher' | 'editor' | 'user')
}

export const isRole = ({ user , role }: RoleAccess) => {
    // Return true or false based on if the user has an admin role
    if (!user || !user?.roles || !role) {
        return false;
    }
    return Boolean(user?.roles?.includes(role));
}

export const isAdminFieldLevel = ({ user , role }: RoleAccess) => {
    // Return true or false based on if the user has an admin role
    return Boolean(user?.roles?.includes(role));
}