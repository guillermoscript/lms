import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';
import { categoryField } from '../fields/category';


const Prompts: CollectionConfig = {
    slug: 'prompts',
    admin: {
        useAsTitle: 'name',
        description: 'Prompts para los cursos, planes, productos, etc.',
    },
    access: {
        create: isAdminOrTeacher,
        read: isAdminOrTeacher,
        update: isAdminOrCreatedBy,
        delete: isAdmin
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre del prompt',
        },
        {
            name: 'prompt',
            type: 'textarea',
            required: true,
            label: 'Prompt',
        },
        categoryField(),
        createdByField(),
        lastModifiedBy(),
        slugField('name'),
    ],

    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy,
        ]
    }
};

export default Prompts;