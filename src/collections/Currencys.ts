import { CollectionConfig } from 'payload/types';
import { isRole } from '../access/isRole';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Currencys: CollectionConfig = {
    slug: 'currencys',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: ({req: {user}}) => {
            return isRole({ user, role: 'admin' })
        },
        update: ({req: {user}}) => {
            return isRole({ user, role: 'admin' })
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
            label: 'Nombre de la moneda',
        },
        {
            name: 'symbol',
            type: 'text',
            required: true,
        },
        {
            name: 'exchangeRate',
            type: 'number',
            required: true,
            label: 'Tipo de cambio',
        },
        {
            name: 'productPrices',
            type: 'relationship',
            relationTo: 'product-prices',
            hasMany: false,
        }
    ],
}

export default Currencys;