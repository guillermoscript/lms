import { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { isRole } from '../access/isRole';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Products: CollectionConfig = {
    slug: 'products',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create : isAdminOrEditor,
        read : () => true,
        update :isAdminOrEditor,
        delete :isAdminOrEditor,
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
        },
        lastModifiedBy(),
        createdByField()
    ],
}

export default Products;