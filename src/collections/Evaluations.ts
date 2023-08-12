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
import { isLoggedIn } from '../access/isLoggedIn';
import tryCatch from '../utilities/tryCatch';
import completedBy from '../services/completedBy';
import { anyone } from '../access/anyone';


// Example Collection - For reference only, this must be added to payload.config.ts to be used.
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
        // read: ({ req: { user } }) => isEnrolledOrHasAccess(['admin', 'teacher'], user),
        read: anyone,
        update: isLoggedIn,
        delete: isAdmin
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre de la evaluación',
            // access: {
            //     update: ({ req: { user } }) => checkRole(['admin', 'teacher'], user as unknown as User)
            // }
        },
        {
            name: 'description',
            type: 'text',
            required: true,
            label: 'Descripción de la evaluación',
            // access: {
            //     update: ({ req: { user } }) => checkRole(['admin', 'teacher'], user as unknown as User)
            // }
        },
        {
            name: 'course',
            type: 'relationship',
            relationTo: 'courses',
            hasMany: false,
            // access: {
            //     update: ({ req: { user } }) => checkRole(['admin', 'teacher'], user as unknown as User)
            // },
            // filterOptions: ({ relationTo, siblingData, user, data }) => {
            //     console.log(user)

            //     return {
            //         createdBy: {
            //             equals: user.id
            //         }
            //     }
            // }
        },
        {
            name: 'endDate',
            type: 'date',
            required: true,
            label: 'Fecha de finalización',
            // access: {
            //     update: ({ req: { user } }) => checkRole(['admin', 'teacher'], user as unknown as User)
            // }
        },
        {
            name: 'maxScore',
            type: 'number',
            required: true,
            label: 'Puntaje máximo',
            // access: {
            //     update: ({ req: { user } }) => checkRole(['admin', 'teacher'], user as unknown as User)
            // }
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
            // access: {
            //     update: ({ req: { user } }) => checkRole(['admin', 'teacher'], user as unknown as User)
            // },
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
            // access: {
            //     update: ({ req: { user } }) => checkRole(['admin', 'teacher'], user as unknown as User)
            // }
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