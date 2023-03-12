import type { BeforeChangeHook } from 'payload/dist/collections/config/types'

export const populateLastModifiedBy: BeforeChangeHook<{
    id: string;
    lastModifiedBy: string;
}> = ({ data, req, operation }) => {
    if (operation === 'create') {
        if (req.body && !req.body.lastModifiedBy) {
            if (req.user) {
                data.lastModifiedBy = req.user.id;
                return data;
            }
        }
    }

    return data
}
