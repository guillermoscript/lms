import { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { isRole } from '../access/isRole';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';


// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Products: CollectionConfig = {
    slug: 'products',
    admin: {
        useAsTitle: 'name',
        group: 'Información de productos',
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
            label: 'Descripción corta del producto',
        },
        {
            name: 'productType',
            type: 'relationship',
            relationTo: [
                'courses',
                'plans',
            ],
            hasMany: false,
        },
        {
            name: 'productStatus',
            type: 'radio',
            required: true,
            defaultValue: 'active',
            options: [
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
            name: 'productPrice',
            type: 'array',
            required: true,
            fields: [
                {
                    name: 'price',
                    type: 'number',
                    required: true,
                    label: 'Precio',
                },
                {
                    name: 'aceptedCurrency',
                    type: 'radio',
                    required: true,
                    defaultValue: 'USD',
                    options: [
                        {
                            label: 'Bolivares',
                            value: 'Bs.',
                        },
                        {
                            label: 'Dolares Americanos',
                            value: 'USD',
                        },
                    ],
                },
            ],
        },
        {
            name: 'productImage',
            type: 'upload', 
            required: true,
            relationTo: 'medias',
        },
        {
            name: 'relatedProducts',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
        },
        {
            name: 'info',
            type: 'richText',
            label: 'Información adicional',
            required: true,
        },
        lastModifiedBy(),
        createdByField(),
        slugField('name'),
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy,
            
        ]
    }
}

export default Products;