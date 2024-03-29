import { CollectionConfig, FieldAccess } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrCreatedBy, isAdminOrCreatedByFieldLevel } from '../access/isAdminOrCreatedBy';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';
import { categoryField } from '../fields/category';
import { createdByField } from '../fields/createdBy';
import { isPublicField } from '../fields/isPublic';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { populateTeacher } from '../hooks/poupulateTeacherField';
import { slugField } from '../fields/slug';
import { anyone } from '../access/anyone';
import { checkRole } from './Users/checkRole';
import payload from 'payload';
import completedBy from '../services/completedBy';
import { adminEmail, noReplyEmail } from '../utilities/consts';
import { Course, User } from '../payload-types';
import { StatusCodes } from 'http-status-codes';

const findIfUserHasAccessToCourse: FieldAccess<{ id: string }, unknown, User> = async ({ req, id }) => {

    const user = req.user as User

    if (!user || !id) {
        return false
    }

    if (checkRole(['admin', 'teacher'], user)) {
        return true
    }

    try {
        const enrollment = await payload.find({
            collection: 'enrollments',
            where: {
                and: [
                    {
                        student: {
                            equals: user?.id,
                        },
                    },
                    {
                        status: {
                            equals: 'active',
                        },
                    },
                    {
                        course: {
                            equals: id,
                        },
                    }
                ],
            }
        })

        if (!enrollment || enrollment.docs.length === 0) {
            return false
        }

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

const Courses: CollectionConfig = {
    slug: 'courses',
    admin: {
        useAsTitle: 'name',
        group: 'Cursos',
    },
    access: {
        create: isAdminOrTeacher,
        read: anyone,
        update: isAdminOrCreatedBy,
        delete: isAdmin
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre del curso',
        },
        {
            name: 'description',
            type: 'text',
            required: true,
            label: 'Descripción del curso',
        },
        categoryField(),
        {
            name: "teacher",
            type: "relationship",
            relationTo: "users",
            hasMany: false,
            label: "Profesor",
            access: {
                read: ({ req }) => {
                    if (!req.user) {
                        return false
                    }
                    if (req.user.roles?.includes('teacher')) {
                        return false
                    }
                    return true
                },
                update: isAdminOrCreatedByFieldLevel

            },
            filterOptions: ({ relationTo, siblingData, user }) => {
                return {
                    roles: {
                        contains: 'teacher' || 'admin'
                    }
                }
            }
        },
        {
            name: 'lessons',
            type: 'relationship',
            relationTo: 'lessons',
            hasMany: true,
            access: {
                read: findIfUserHasAccessToCourse,
                update: isAdminOrCreatedByFieldLevel
            },
        },
        {
            name: 'evaluations',
            type: 'relationship',
            relationTo: 'evaluations',
            hasMany: true,
            access: {
                read: findIfUserHasAccessToCourse,
                update: isAdminOrCreatedByFieldLevel
            },
        },
        {
            name: 'relatedCourses',
            type: 'relationship',
            relationTo: 'courses',
            label: 'Cursos relacionados',
            hasMany: true,
        },
        {
            name: 'completedBy',
            type: 'relationship',
            relationTo: 'users',
            label: 'Completado por',
            hasMany: true,
        },
        createdByField(),
        lastModifiedBy(),
        isPublicField(),
        slugField('name'),
    ],
    hooks: {
        beforeChange: [
            populateTeacher,
            populateCreatedBy,
            populateLastModifiedBy,
        ]
    },
    endpoints: [
        {
            path: '/:id/completed-by',
            method: 'post',
            handler: async (req, res, next) => {
                const [courseUpdated, error] = await completedBy({
                    collection: 'courses',
                    id: req.params.id,
                    user: req.user,
                    payload
                })

                if (error) {
                    return res.status(error.status).json({
                        message: error.message,
                        error
                    })
                }

                console.log(courseUpdated, "courseUpdated")
                const course = courseUpdated as Course

                req.payload.sendEmail({
                    from: noReplyEmail,
                    to: req.user.email,
                    subject: 'Curso completado',
                    html: `<h1>Felicidades</h1><p>Has completado el curso ${course.name}</p>`
                })

                req.payload.sendEmail({
                    from: noReplyEmail,
                    to: adminEmail!,
                    subject: 'Curso completado',
                    html: `<h1>El usuario ${req.user.email} ha completado el curso ${course.name}</h1>`
                })

                res.status(StatusCodes.OK).json({
                    message: 'Curso completado'
                })
            }
        },
    ]
}

export default Courses;