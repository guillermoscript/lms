import { CollectionConfig } from 'payload/types';
import { isRole } from '../access/isRole';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Evaluations: CollectionConfig = {
    slug: 'evaluations',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: ({req: {user}}) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'teacher' }) || isRole({ user, role: 'editor' })
        },
        update: ({req: {user}}) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'teacher' }) || isRole({ user, role: 'editor' })
        },
        delete: ({req: {user}}) => {
            return isRole({ user, role: 'admin' })
        },
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre del curso',
        },
        {
            name: 'description',
            type: 'text',
            required: true,
            label: 'Descripción del curso',
        },
        {
            name: 'course',
            type: 'relationship',
            relationTo: 'courses',
            hasMany: false,
        },
        {
            name: 'endDate',
            type: 'date',
            required: true,
            label: 'Fecha de finalización',
        },
        {
            name: 'maxScore',
            type: 'number',
            required: true,
            label: 'Puntaje máximo',
        },
    ],
}

export default Evaluations;