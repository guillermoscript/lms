import { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { isEnrolledOrHasAccess } from '../access/isEnrolledOrHasAccess';
import periodicity from '../fields/periodicity';
import transactionRelation from '../fields/transactionRelation';
import { checkRole } from './Users/checkRole';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Subscriptions: CollectionConfig = {
    slug: 'subscriptions',
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
        {
            name: 'startDate',
            type: 'date',
            required: true,
            label: 'Fecha de inicio',
        },
        {
            name: 'endDate',
            type: 'date',
            required: true,
            label: 'Fecha de finalización',
        },
        {
            name: 'enrollment',
            type: 'relationship',
            relationTo: 'enrollments',
            hasMany: false,
        },
        periodicity(),
        transactionRelation()
    ],
}

export default Subscriptions;