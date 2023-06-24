import { CollectionConfig } from 'payload/types';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';
import { anyone } from '../access/anyone';


const Comments: CollectionConfig = {
    slug: 'comments',
    admin: {
        useAsTitle: 'id',
        group: 'Comentarios',
    },
    access: {
        create: anyone,
        // TODO: Only active subscriptions can access this
        read: anyone,
        update: isAdminOrCreatedBy,
        delete: isAdminOrCreatedBy
    },
    fields: [
        {
            name: 'comment',
            type: 'text',
            required: true,
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
        },
        {
            name: 'likes',
            type: 'number',
            required: false,
        },
        {
            name: 'dislikes',
            type: 'number',
            required: false,
        },
        {
            name: 'commentable',
            type: 'relationship',
            relationTo: ['products', 'lessons', 'courses', 'comments', 'evaluations'],
            hasMany: false,
        },
        createdByField(),
        lastModifiedBy(),
        slugField('id')
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy,
        ]
    }
};

export default Comments;