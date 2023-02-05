import { CollectionConfig } from 'payload/types';
import { isRole } from '../access/isRole';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const ProductPrices: CollectionConfig = {
    slug: 'product-prices',
    admin: {
        useAsTitle: 'price'
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
            name: 'price',
            type: 'number',
            required: true,
            label: 'Precio',
        },
        {
            name: 'currency',
            type: 'relationship',
            relationTo: 'currencys',
            hasMany: true,
            label: 'Moneda',
        },
        {
            name: 'product',
            type: 'relationship',
            relationTo: [
                'courses'
                // 'subscriptions',
            ],
            hasMany: false,
            label: 'Producto',
        }
    ],
}

export default ProductPrices;