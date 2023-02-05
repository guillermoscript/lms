import { CollectionConfig } from 'payload/types';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Subscriptions: CollectionConfig = {
    slug: 'subscriptions',
    admin: {
        useAsTitle: 'id'
    },
    fields: [
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
            name: 'startDate',
            type: 'date',
            required: true,
            label: 'Fecha de inicio',
        },
        {
            name: 'endDate',
            type: 'date',
            required: true,
            label: 'Fecha de finalización',
        },
        {
            name: 'enrollment',
            type: 'relationship',
            relationTo: 'enrollments',
            hasMany: false,
        }
    ],
}

export default Subscriptions;