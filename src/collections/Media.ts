import { CollectionConfig } from 'payload/types';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';

const Media: CollectionConfig = {
  slug: 'medias',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
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
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    // {
    //   name: 'url',
    //   type: 'text',
    //   required: true,
    // },
    {
      name: 'filename',
      type: 'text',
      required: true,
    },
    {
      name: 'altText',
      type: 'text',
      required: true,
    },
    createdByField(),
    lastModifiedBy()
  ],
  
  hooks: {
    beforeChange: [
        populateCreatedBy,
        populateLastModifiedBy
    ]
}
};

export default Media;