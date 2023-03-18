import payload from 'payload';
import { FilterOptions } from 'payload/dist/fields/config/types';
import { PaginatedDocs } from 'payload/dist/mongoose/types';
import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';
import { isEnrolledOrHasAccess } from '../access/isEnrolledOrHasAccess';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';


// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Exams: CollectionConfig = {
    slug: 'Exams',
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
            filterOptions: ({ relationTo, siblingData, user }) => {
                return {
                    createdBy: {
                        equals: user.id
                    }
                }
            }
        },
        {
            name: 'questions',
            type: 'array',
            label: 'Preguntas',
            fields: [
                {
                    name: 'multipleOptions',
                    type: 'radio',
                    label: 'Elección unica',
                    options: [
                        {
                            label: 'Si',
                            value: 'verdadero',
                        },
                        {
                            label: 'No',
                            value: 'falso',
                        },
                    ]
                },
                {
                    name: 'question',
                    type: 'text',
                    label: 'Pregunta',
                },
                {
                    name: 'options',
                    type: 'array',
                    label: 'Opciones',
                    fields: [
                        {
                            name: 'option',
                            type: 'text',
                            label: 'Opción',
                        },
                        {
                            name: 'correct',
                            type: 'radio',
                            label: 'Correcta',
                            options: [
                                {
                                    label: 'Si',
                                    value: 'verdadero',
                                },
                                {
                                    label: 'No',
                                    value: 'falso',
                                },
                            ]
                        },
                    ]
                },
            ]
        },
        lastModifiedBy(),
        createdByField()
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy
        ]
    }
}

export default Exams;