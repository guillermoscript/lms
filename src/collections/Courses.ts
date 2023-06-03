import type { BeforeChangeHook } from 'payload/dist/collections/config/types'
import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { isAdminOrTeacher } from '../access/isAdminOrTeacher';
import { categoryField } from '../fields/category';
import { createdByField } from '../fields/createdBy';
import { isPublicField } from '../fields/isPublic';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { populateTeacher } from '../hooks/poupulateTeacherField';
import { slugField } from '../fields/slug';
import { isEnrolledOrHasAccess } from '../access/isEnrolledOrHasAccess';
import { anyone } from '../access/anyone';
import { checkRole } from './Users/checkRole';
import payload from 'payload';


// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Courses: CollectionConfig = {
    slug: 'courses',
    admin: {
        useAsTitle: 'name'
    },
    access: {
        create: isAdminOrTeacher,
        // read: ({ req: { user } }) => isEnrolledOrHasAccess(['admin','teacher'], user),
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
                }
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
                read: ({ req }) => {
                    
                    const user = req.user

                    if (!user) {
                        return false
                    }

                    if (checkRole([ 'admin','teacher'], req.user)) {
                        return true
                    }

                    async function findIfUserIsEnrolled() {
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
                                                equals: req.params.id,
                                            },
                                        }
                                    ],
                                }
                            })

                            console.log(enrollment, "enrollment")

                            // return enrollment ? true : false
                            if (!enrollment || enrollment.docs.length === 0) {
                                return false
                            }

                            return true
                        } catch (error) {
                            console.log(error)
                            return false
                        }
                    }

                    return findIfUserIsEnrolled()
                },
            },
        },
        {
            name: 'reviews',
            type: 'relationship',
            relationTo: 'reviews',
            hasMany: true,
        },
        {
            name: 'relatedCourses',
            type: 'relationship',
            relationTo: 'courses',
            label: 'Cursos relacionados',
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
    }
}

export default Courses;