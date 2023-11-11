import { CollectionConfig } from 'payload/types';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';
import { isLoggedIn } from '../access/isLoggedIn';
import { hasAccessOrIsSelf } from '../access/hasAccessOrIsSelf';


const UserDocuments: CollectionConfig = {
    slug: 'user-documents',
    access: {
        create: isLoggedIn,
        read: hasAccessOrIsSelf,
        update: hasAccessOrIsSelf,
        delete: hasAccessOrIsSelf,
    },
    admin: {
        useAsTitle: 'filename',
        defaultColumns: ['filename', 'altText', 'createdBy', 'createdAt'],
    },
    upload: {
        staticURL: '/user-documents',
        staticDir: 'user-documents',
        imageSizes: [
            {
                name: 'thumbnail',
                width: 400,
                height: 300,
                position: 'centre',
            },
            {
                name: 'card',
                width: 768,
                height: 1024,
                position: 'centre',
            },
            {
                name: 'tablet',
                width: 1024,
                // By specifying `undefined` or leaving a height undefined,
                // the image will be sized to a certain width,
                // but it will retain its original aspect ratio
                // and calculate a height automatically.
                height: undefined,
                position: 'centre',
            },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['application/pdf'],
    },
    fields: [
        
        createdByField(),
        lastModifiedBy(),
        slugField('filename')
    ],

    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy,
        ],
    }
};

export default UserDocuments