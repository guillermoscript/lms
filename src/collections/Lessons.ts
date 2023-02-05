import { CollectionConfig } from 'payload/types';
import { isRole } from '../access/isRole';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Lessons: CollectionConfig = {
    slug: 'lessons',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: ({req: {user}}) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'teacher' }) || isRole({ user, role: 'editor' })
        },
        read: ({req: {user}}) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'teacher' }) || isRole({ user, role: 'editor' })
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
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre de la lección',
        },
        {
            name: 'description',
            type: 'text',
            required: true,
            label: 'Descripción de la lección',
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
            label: 'Contenido',
        }
    ],
}

export default Lessons;