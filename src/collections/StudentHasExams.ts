import payload from 'payload';
import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';
import { isEnrolledOrHasAccess } from '../access/isEnrolledOrHasAccess';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { checkRole } from './Users/checkRole';
import { slugField } from '../fields/slug';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const StudentHasExams: CollectionConfig = {
    slug: 'student-has-exams',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: ({ req: { user } }) => {
            if (checkRole(['admin', 'teacher'], user)) {
                return true
            }
            return false
        },
        read: ({ req: { user } }) => isEnrolledOrHasAccess(['admin', 'editor', 'teacher'],user),
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
            name: 'course',
            type: 'relationship',
            relationTo: 'courses',
            hasMany: false,
        },
        {
            name: 'endDate',
            type: 'date',
            required: true,
            label: 'Fecha de finalización',
        },
        {
            name: 'maxScore',
            type: 'number',
            required: true,
            label: 'Puntaje máximo',
        },
        lastModifiedBy(),
        createdByField(),
        slugField(),
    ],
    
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy
        ]
    }
}

export default StudentHasExams;