import { Access } from "payload/config";
import { FieldAccess } from "payload/types";
import { checkRole } from "../collections/Users/checkRole";

export const isAdminOrCreatedBy: Access = ({ req: { user } }) => {
    // Scenario #1 - Disallow all non-logged in users
    if (!user) {    
        return false;
    }
    // Scenario #2 - Check if user has the 'admin' role
    if (user.roles?.includes('admin')) {
        return true;
    }

    // Scenario #3 - Allow only documents with the current user set to the 'createdBy' field
    // Will return access for only documents that were created by the current user
    return {
        createdBy: {
            equals: user.id,
        },
    };
}


export const isAdminOrCreatedByFieldLevel: FieldAccess = ({ req: { user }, siblingData }) => {
    // Return true or false based on if the user has an admin role
    if (!user) {
        return false
    }
    if (checkRole(['admin'], user)) {
        return true
    }
    if (siblingData?.teacher?.id === user.id) {
        return true
    }
    if (siblingData?.createdBy?.id === user.id) {
        return false
    }
    return false
}