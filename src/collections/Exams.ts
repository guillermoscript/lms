import { CollectionConfig } from 'payload/types';
import { isRole } from '../access/isRole';
import { isSelfStudent } from '../access/isSelfStudent';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Exams: CollectionConfig = {
    slug: 'Exams',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: (data) => {
            const {req: {user}} = data
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'teacher' }) || isRole({ user, role: 'editor' })
        },
        read:  (data) => {
            const {req: {user}} = data
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'teacher' }) || isRole({ user, role: 'editor' }) || isSelfStudent(data)
        },
        update:  (data) => {
            const {req: {user}} = data
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'teacher' }) || isRole({ user, role: 'editor' })
        },
        delete:  (data) => {
            const {req: {user}} = data
            return isRole({ user, role: 'admin' })
        }
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