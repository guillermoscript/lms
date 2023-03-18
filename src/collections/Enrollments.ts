import { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { isEnrolledOrHasAccess } from '../access/isEnrolledOrHasAccess';
import orderRelation from '../fields/orderRelation';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { checkRole } from './Users/checkRole';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Enrollments: CollectionConfig = {
    slug: 'enrollments',
    admin: {
        useAsTitle: 'id'
    },
    access: {
        create: ({ req: { user } }) => {
            if (checkRole(['admin', 'editor', 'teacher'], user)) {
                return true
            }
            // TODO: let a user type student enroll in a course
            return false
        },
        read: ({ req: { user } }) => isEnrolledOrHasAccess(['admin', 'editor', 'teacher'], user),
        update: isAdminOrEditor,
        delete: isAdminOrEditor
    },
    fields: [
        {
            name: 'student',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
            label: 'Estudiante',
        },
        {
            name: 'course',
            type: 'relationship',
            relationTo: 'courses',
            hasMany: false,
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
        orderRelation()
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy
        ]
    }
}

export default Enrollments;