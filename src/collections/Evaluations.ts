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
import { FormBlock } from '../blocks/Form';
import { slugField } from '../fields/slug';
import { User } from '../payload-types';
import { checkRole } from './Users/checkRole';


// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Evaluations: CollectionConfig = {
    slug: 'evaluations',
    admin: {
        useAsTitle: 'name',
        hidden(args) {
            const {  user  } = args
            return !checkRole(['admin', 'teacher'], user as unknown as User)
        },
    },
    access: {
        create: isAdminOrTeacher,
        read: ({ req: { user } }) => isEnrolledOrHasAccess(['admin', 'teacher'], user),
        update: isAdminOrCreatedBy,
        delete: isAdmin
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre de la evaluación',
        },
        {
            name: 'description',
            type: 'text',
            required: true,
            label: 'Descripción de la evaluación',
        },
        {
            name: 'course',
            type: 'relationship',
            relationTo: 'courses',
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
        {
            name: 'evaluationType',
            type: 'radio',
            required: true,
            label: 'Tipo de evaluación',
            options: [
                {
                    label: 'Examen',
                    value: 'exam'
                },
                {
                    label: 'Tarea',
                    value: 'homework'
                }
            ]
        },
        {
            name: 'homework',
            type: 'array',
            label: 'Tareas',
            fields: [
                {
                    name: 'content',
                    type: 'richText',
                    required: true,
                    label: 'Contenido',
                }
            ],
            admin: {
                condition: (data) => data.evaluationType === 'homework'
            }
        },
        {
            name: 'exam',
            type: 'array',
            label: 'Exámenes',
            fields: [
                {
                    name: 'content',
                    type: 'richText',
                    required: true,
                    label: 'Contenido',
                },
                {
                    name: 'questions',
                    type: 'array',
                    label: 'Preguntas',
                    fields: [
                        {
                            name: 'question',
                            type: 'richText',
                            required: true,
                            label: 'Pregunta',
                        }
                    ]
                },
                {
                    name: 'formExamn',
                    type: 'blocks',
                    required: true,
                    blocks: [
                        FormBlock,
                    ],
                    label: 'Formulario de examen'
                },
            ],
            admin: {
                condition: (data) => data.evaluationType === 'exam'
            }
        },
        lastModifiedBy(),
        createdByField(),
        slugField('name'),
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy,
            
        ]
    }
}

export default Evaluations;