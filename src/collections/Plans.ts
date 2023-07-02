import { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { categoryField } from '../fields/category';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import periodicity from '../fields/periodicity';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';


// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Plans: CollectionConfig = {
    slug: 'plans',
    admin: {
        useAsTitle: 'name',
        group: 'Información de productos',
    },
    access: {
        create : isAdminOrEditor,
        read : () => true,
        update : isAdminOrEditor,
        delete : isAdminOrEditor,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre del plan',
        },
        {
            name: 'description',
            type: 'text',
            required: true,
            label: 'Descripción del plan',
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
        categoryField(),
        {
            name: 'courses',
            type: 'relationship',
            relationTo: 'courses',
            hasMany: true,
        },
        {
            name: 'subscriptions',
            type: 'relationship',
            relationTo: 'subscriptions',
            hasMany: true,
        },        
        periodicity(),
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

export default Plans;