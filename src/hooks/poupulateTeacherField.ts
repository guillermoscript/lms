import type { BeforeChangeHook } from 'payload/dist/collections/config/types'
export const populateTeacher: BeforeChangeHook<{
    teacher: string;
    id: string;
}> = ({ data, req, operation }) => {
    if (operation === 'create') {
        if (req.body && !req.body.teacher) {
            if (req.user.roles?.includes('teacher')) {
                data.teacher = req.user.id;
                return data;
            }
        }
    }

    return data
}