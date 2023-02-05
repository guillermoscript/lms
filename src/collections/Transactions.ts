import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isRole } from '../access/isRole';
import { isSelfStudent } from '../access/isSelfStudent';
// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Transactions: CollectionConfig = {
    slug: 'transactions',
    admin: {
        useAsTitle: 'id'
    },
    access: {
        read:  (data) => {
            const {req: {user}} = data
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' }) || isSelfStudent(data)
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
                'subscriptions', 
                // 'certificates'
            ],
            hasMany: false,
        }
    ],
}

export default Transactions;