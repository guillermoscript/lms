import { CollectionConfig } from 'payload/types';
import { isRole } from '../access/isRole';
import { isSelfStudent } from '../access/isSelfStudent';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Homeworks: CollectionConfig = {
    slug: 'homework',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: ({req: {user}}) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'teacher' }) || isRole({ user, role: 'editor' })
        },
        read:  (data) => {
            const {req: {user}} = data
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'teacher' }) || isRole({ user, role: 'editor' }) || isSelfStudent(data)
        },
        update: ({req: {user}}) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'teacher' }) || isRole({ user, role: 'editor' })
        },
        delete: ({req: {user}}) => {
            return isRole({ user, role: 'admin' })
        }
    },
    fields: [
        {
            name: 'content',
            type: 'richText',
            required: true,
            label: 'Contenido',
        },
        {
            name: 'evaluation',
            type: 'relationship',
            relationTo: 'evaluations',
            hasMany: false,
        },
    ],
}

export default Homeworks;