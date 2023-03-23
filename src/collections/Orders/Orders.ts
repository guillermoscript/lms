import { CollectionConfig } from 'payload/types';
import { anyone } from '../../access/anyone';
import { isAdmin } from '../../access/isAdmin';
import { isRole } from '../../access/isRole';
import { isSelfStudent } from '../../access/isSelfStudent';
import { createdByField } from '../../fields/createdBy';
import { lastModifiedBy } from '../../fields/lastModifiedBy ';
import { populateCreatedBy } from '../../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../../hooks/populateLastModifiedBy';
import { checkRole } from '../Users/checkRole';
import createOrderAbleAfterChange from './hooks/createOrderAbleAfterChange';
import { creationEmailNotification } from './hooks/creationEmailNotification';
// Example Collection - For reference only, this must be added to payload.config.ts to be used.

const Orders: CollectionConfig = {
    slug: 'orders',
    admin: {
        useAsTitle: 'id'
    },
    access: {
        create: anyone,
        read:  (data) => {
            const {req: {user}} = data
            return checkRole(['admin', 'editor', 'teacher'], user) || isSelfStudent(data)
        },
        update: ({req: {user}}) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' })
        },
        delete: isAdmin
    },
    fields: [
        // {
        //     name: 'amount',
        //     type: 'number',
        //     required: true,
        // },
        {
            name: 'status',
            type: 'radio',
            defaultValue: 'inactive',
            options: [ // required
                {
                    label: 'Activo',
                    value: 'active',
                },
                {
                    label: 'Inactivo',
                    value: 'inactive',
                },
                {
                    label: 'Cancelado',
                    value: 'canceled',
                },
                {
                    label: 'Pendiente',
                    value: 'pending',
                }
            ],
            hooks: {
                afterChange: [
                    createOrderAbleAfterChange
                ]
            }
        },
        {
            name: 'type',
            type: 'radio',
            defaultValue: 'order',
            options: [ // required
                {
                    label: 'Orden',
                    value: 'order',
                },
                {
                    label: 'Renovación',
                    value: 'renewal',
                },
                {
                    label: 'Matrícula',
                    value: 'enrollment',
                },
                // {
                //     label: 'Inscripción',
                //     value: 'subscription',
                // }
            ],
        },
        {
            name: 'customer',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
        },
        {
            name: 'products',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
        },
        {
            name: 'referenceNumber',
            type: 'text',
            label: 'Número de referencia',
        },
        {
            name: 'paymentMethod',
            type: 'relationship',
            relationTo: 'payment-methods',
            hasMany: false,
        },
        {
            name: 'details',
            type: 'richText',
            label: 'Detalles',
        },
        createdByField(),
        lastModifiedBy(),
    ],
    hooks: {
        afterChange: [
            creationEmailNotification
        ],
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy
        ]
    }
}

export default Orders;