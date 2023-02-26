import type { BeforeChangeHook } from 'payload/dist/collections/config/types'

export const populateCreatedBy: BeforeChangeHook<{
    id: string;
    createdBy: string;
}> = ({ data, req, operation }) => {
    if (operation === 'create') {
        if (req.body && !req.body.createdBy) {
            if (req.user) {
                data.createdBy = req.user.id;
                return data;
            }
        }
    }

    return data
}
