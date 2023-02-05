import { CollectionConfig } from 'payload/types';
import { isRole } from '../access/isRole';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Plans: CollectionConfig = {
    slug: 'plans',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create : ({req: {user}}) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' })
        },
        read :({req: {user}}) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' })
        },
        update :({req: {user}}) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' })
        },
        delete :({req: {user}}) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' })
        },
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre del plan',
        },
        {
            name: 'description',
            type: 'text',
            required: true,
            label: 'Descripción del plan',
        },
        {
            name: 'status',
            type: 'radio',
            options: [ // required
                {
                    label: 'Activo',
                    value: 'active',
                },
                {
                    label: 'Inactivo',
                    value: 'inactive',
                },
            ],
        },
        {
            name: 'courses',
            type: 'relationship',
            relationTo: 'courses',
            hasMany: true,
        },
    ],
}

export default Plans;