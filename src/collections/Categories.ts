import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name'
  },
  access: {
    create: isAdminOrTeacher,
    read: () => true,
    update: isAdminOrCreatedBy,
    delete: isAdmin
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre de la categoría',
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Descripción de la categoría',
    },
    {
      name: 'image',
      type: 'upload', 
      required: true,
      relationTo: 'medias',
  },
    createdByField(),
    lastModifiedBy(),
  ],
  
  hooks: {
    beforeChange: [
        populateCreatedBy,
        populateLastModifiedBy
    ]
}
};

export default Categories;