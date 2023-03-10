import { CollectionConfig } from 'payload/types';
import { anyone } from '../../access/anyone';
import { isAdmin } from '../../access/isAdmin';
import { isRole } from '../../access/isRole';
import { isSelfStudent } from '../../access/isSelfStudent';
import { populateCreatedBy } from '../../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../../hooks/populateLastModifiedBy';
import { checkRole } from '../Users/checkRole';
import createTransactionAbleAfterChange from './hooks/createTransactionAbleAfterChange';
import { creationEmailNotification } from './hooks/creationEmailNotification';
// Example Collection - For reference only, this must be added to payload.config.ts to be used.

const Transactions: CollectionConfig = {
    slug: 'transactions',
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
        {
            name: 'amount',
            type: 'number',
            required: true,
        },
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
            ],
            hooks: {
                afterChange: [
                    createTransactionAbleAfterChange
                ]
            }
        },
        {
            name: 'customer',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
        },
        {
            name: 'transactionAble',
            type: 'relationship',
            relationTo: [
                'courses', 
                // 'lessons', 
                // 'tests', 
                // 'plans', 
                'enrollments' 
                // 'certificates'
            ],
            hasMany: false,
        },
        {
            name: 'isSubscription',
            type: 'checkbox',
            defaultValue: true,
            label: '??Es una suscripci??n?',
        },
        {
            name: 'periodicity',
            type: 'radio',
            options: [ // required
                {
                    label: 'Mensual',
                    value: 'monthly',
                },
                {
                    label: 'Bimestral',
                    value: 'bimonthly',
                },
                {
                    label: 'Trimestral',
                    value: 'quarterly',
                },
                {
                    label: 'Semestral',
                    value: 'biannual',
                },
                {
                    label: 'Anual',
                    value: 'annual',
                },
                {
                    label: 'Personalizado',
                    value: 'custom',
                }
            ],
            admin: {
                condition: (data, siblingData) => {
                    if (data.isSubscription) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
    },
        {
            name: 'details',
            type: 'richText',
            label: 'Detalles',
        },
        {
            name: 'referenceNumber',
            type: 'text',
            label: 'N??mero de referencia',
        }
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

export default Transactions;