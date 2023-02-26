import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';
import { isEnrolledOrHasAccess } from '../access/isEnrolledOrHasAccess';

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
        }
    ],
}

export default Exams;