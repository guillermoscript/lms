import { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { isRole } from '../access/isRole';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const ProductPrices: CollectionConfig = {
    slug: 'product-prices',
    admin: {
        useAsTitle: 'price'
    },
    access: {
        create : isAdminOrEditor,
        read :() => true,
        update :isAdminOrEditor,
        delete :isAdminOrEditor
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
            relationTo: 'currencies',
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