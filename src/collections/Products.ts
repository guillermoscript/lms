import { CollectionConfig } from 'payload/types';
import { isRole } from '../access/isRole';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Products: CollectionConfig = {
    slug: 'products',
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
            label: 'Nombre del producto',
        },
        {
            name: 'description',
            type: 'text',
            required: true,
            label: 'Descripción del producto',
        },
        {
            name: 'productPrices',
            type: 'relationship',
            relationTo: 'product-prices',
            hasMany: true,
        },
        {
            name: 'productType',
            type: 'relationship',
            relationTo: [
                'courses',
                'subscriptions',
            ],
            hasMany: true,
        }
    ],
}

export default Products;