import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';
import { isEnrolledOrHasAccess } from '../access/isEnrolledOrHasAccess';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Lessons: CollectionConfig = {
    slug: 'lessons',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: isAdminOrTeacher,
        read:  ({ req: { user } }) => isEnrolledOrHasAccess(['admin', 'editor', 'teacher'],user),
        update: isAdminOrCreatedBy,
        delete:  isAdmin
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre de la lección',
        },
        {
            name: 'description',
            type: 'text',
            required: true,
            label: 'Descripción de la lección',
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
            label: 'Contenido',
        },
        lastModifiedBy(),
        createdByField()
    ],
}

export default Lessons;