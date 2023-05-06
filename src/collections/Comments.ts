import { CollectionConfig } from 'payload/types';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';


const Comments: CollectionConfig = {
    slug: 'comments',
    admin: {
        useAsTitle: 'id'
    },
    access: {
        create: isAdminOrCreatedBy,
        // TODO: Only active subscriptions can access this
        read: () => true,
        update: isAdminOrCreatedBy,
        delete: isAdminOrCreatedBy
    },
    fields: [
        {
            name: 'comment',
            type: 'text',
            required: false,
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
            name: 'lesson',
            type: 'relationship',
            relationTo: 'lessons',
            hasMany: false,
        },
        {
            name: 'replyTo',
            type: 'relationship',
            relationTo: 'comments',
            hasMany: true,
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