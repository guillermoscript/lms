import { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { isRole } from '../access/isRole';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Currencies: CollectionConfig = {
    slug: 'currencies',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: isAdminOrEditor,
        read : () => true,
        update: isAdminOrEditor,
        delete: isAdminOrEditor
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
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy
        ]
    }
}

export default Currencies;