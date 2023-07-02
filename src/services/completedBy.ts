import { Payload } from "payload";
import { User } from "../payload-types";
import { Response } from "express";
import tryCatch from "../utilities/tryCatch";
import { StatusCodes } from "http-status-codes";

type completedBy = {
    collection: string,
    id: User['id'],
    user: User,
    payload: Payload
}

export default async function completedBy({
    collection,
    id,
    user,
    payload,
}: completedBy) {
    
    const [item, error] = await tryCatch(payload.findByID({
        collection,
        id,
    }))

    if (error) {
        return [null, {
            message: 'Error finding item',
            error,
            status: StatusCodes.INTERNAL_SERVER_ERROR
        }]
    }

    const completedBy = item?.completedBy || []

    if (completedBy.includes(user.id)) {
        return [null, {
            message: 'Already completed',
            status: StatusCodes.BAD_REQUEST,
            error: null
        }]
    }

    const [updatedItem, errorUpdatedItem] = await tryCatch(payload.update({
        collection,
        id,
        data: {
            completedBy: [...completedBy, user.id]
        }
    }))

    if (errorUpdatedItem) {
        return [null, {
            message: 'Error updating item',
            error: errorUpdatedItem,
            status: StatusCodes.INTERNAL_SERVER_ERROR
        }]
    }

    return [updatedItem, null]
}