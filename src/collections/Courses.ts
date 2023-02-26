import type { BeforeChangeHook } from 'payload/dist/collections/config/types'
import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';
import { createdByField } from '../fields/createdBy';
import { isPublicField } from '../fields/isPublic';
import { populateCreatedBy } from '../hooks/populateCreatedBy';

const populateTeacher: BeforeChangeHook<{
    teacher: string;
    id: string;
}> = ({ data, req, operation }) => {
    if (operation === 'create') {
        if (req.body && !req.body.teacher) {
            if (req.user.roles?.includes('teacher')) {
                data.teacher = req.user.id;
                return data;
            }
        }
    }

    return data
}

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Courses: CollectionConfig = {
    slug: 'courses',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: isAdminOrTeacher,
        read : () => true,
        update: isAdminOrCreatedBy,
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
            access: {
                read: ({req }) => {
                    if (!req.user) {
                        return false
                    }
                    if (req.user.roles?.includes('teacher')) {
                        return false
                    }
                    return true
                }
            },
        },
        {
            name: 'enrollments',
            type: 'relationship',
            relationTo: 'enrollments',
            hasMany: true,
        },
        // {
        //     name: 'productPrices',
        //     type: 'relationship',
        //     relationTo: 'product-prices',
        //     hasMany: true,
        // },
        createdByField(),
        isPublicField()
    ],
    hooks: {
        beforeChange: [
            populateTeacher,
            populateCreatedBy
        ]
    }
}

export default Courses;