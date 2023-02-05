import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Courses: CollectionConfig = {
    slug: 'courses',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: isAdminOrTeacher,
        update: isAdminOrTeacher,
        delete: isAdmin
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre del curso',
        },
        {
            name: 'description',
            type: 'text',
            required: true,
            label: 'Descripción del curso',
        },
        {
            name: "teacher",
            type: "relationship",
            relationTo: "users",
            hasMany: false,
            label: "Profesor",
        },
        {
            name: 'enrollments',
            type: 'relationship',
            relationTo: 'enrollments',
            hasMany: true,
        },
        {
            name: 'productPrices',
            type: 'relationship',
            relationTo: 'product-prices',
            hasMany: true,
        }
    ],
}

export default Courses;