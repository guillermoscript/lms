import { CollectionConfig } from 'payload/types';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';


const Reviews: CollectionConfig = {
    slug: 'reviews',
    admin: {
        useAsTitle: 'id',
        group: 'Comentarios',
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
            name: 'review',
            type: 'text',
            required: false,
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
            name: 'reviewable',
            type: 'relationship',
            relationTo: ['products', 'lessons', 'courses', 'comments', 'evaluations'],
            hasMany: false,
        },
        {
            name: 'rating',
            type: 'select',
            options: [
                {
                    label: '1',
                    value: '1',
                },
                {
                    label: '1.5',
                    value: '1.5',
                },
                {
                    label: '2',
                    value: '2',
                },
                {
                    label: '2.5',
                    value: '2.5',
                },
                {
                    label: '3',
                    value: '3',
                },
                {
                    label: '3.5',
                    value: '3.5',
                },
                {
                    label: '4',
                    value: '4',
                },
                {
                    label: '4.5',
                    value: '4.5',
                },
                {
                    label: '5',
                    value: '5',
                }
            ]
        },
        createdByField(),
        lastModifiedBy(),
        slugField()
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy,
            
        ]
    }
};

export default Reviews;