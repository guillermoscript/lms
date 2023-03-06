import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';
import { isEnrolledOrHasAccess } from '../access/isEnrolledOrHasAccess';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';

const Homeworks: CollectionConfig = {
    slug: 'homework',
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
            name: 'content',
            type: 'richText',
            required: true,
            label: 'Contenido',
        },
        {
            name: 'evaluation',
            type: 'relationship',
            relationTo: 'evaluations',
            hasMany: false,
        },
        lastModifiedBy(),
        createdByField()
    ],
}

export default Homeworks;