import payload from 'payload';
import { Access, CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { FormBlock } from '../blocks/Form';
import { slugField } from '../fields/slug';
import { User } from '../payload-types';
import { checkRole } from './Users/checkRole';
import { isLoggedIn } from '../access/isLoggedIn';
import tryCatch from '../utilities/tryCatch';
import completedBy from '../services/completedBy';
import { anyone } from '../access/anyone';
import hasAccessOrIsEnrolled from '../access/hasAccessOrIsEnrolled';

const Evaluations: CollectionConfig = {
    slug: 'evaluations',
    admin: {
        useAsTitle: 'name',
        hidden(args) {
            const {  user  } = args
            return !checkRole(['admin', 'teacher'], user as unknown as User)
        },
        group: 'Cursos',
    },
    access: {
        create: isAdminOrTeacher,
        // TODO 
        read: async ({ req: { user, payload }, id }) =>  await hasAccessOrIsEnrolled({ req: { user, payload }, id }, 'evaluations'),
        update: isLoggedIn,
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
            name: 'score',
            type: 'number',
            required: true,
            label: 'Puntaje de experiencia',
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
                    name: 'formExamn',
                    type: 'blocks',
                    required: true,
                    blocks: [
                        FormBlock,
                    ],
                    label: 'Formulario de examen'
                },
                {
                    name: 'timeToAnswer',
                    type: 'number',
                    required: true,
                    label: 'Tiempo para responder (minutos)',
                }

            ],
            admin: {
                condition: (data) => data.evaluationType === 'exam'
            },
        },
        {
            name: 'order',
            type: 'number',
            required: true,
            label: 'Orden',
        },
        {
            name: 'completedBy',
            type: 'relationship',
            relationTo: 'users',
            hasMany: true,
            label: 'Completado por',
        },
        {
            name: 'approvedBy',
            type: 'relationship',
            relationTo: 'users',
            hasMany: true,
            label: 'Aprobado por',
        },
        {
            name: 'reprovedBy',
            type: 'relationship',
            relationTo: 'users',
            hasMany: true,
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
    },
    endpoints: [
        {
			path: '/:id/completed-by',
			method: 'post',
			handler: async (req, res, next) => {
                console.log(req.params.id, "req.params.id")
                const [updatedEvaluation, error] = await completedBy({
                    collection: 'evaluations',
                    id: req.params.id,
                    user: req.user,
                    payload: payload,
                })

                if (error) {
                    return res.status(error.status).json({
                        message: error.message,
                        error
                    })
                }

                return res.status(200).json(updatedEvaluation)
            }
        },
    ]
}

export default Evaluations;