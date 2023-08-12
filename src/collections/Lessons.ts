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
import { User } from '../payload-types';
import { checkRole } from './Users/checkRole';
import completedBy from '../services/completedBy';
import addScoreToUser from '../services/addScoreToUser';

const Lessons: CollectionConfig = {
    slug: 'lessons',
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
        // TODO: Only active subscriptions can access this
        read: ({ req: { user, payload }, id  }) => {
            
            console.log('id', id)
            
            if (!user) {
                return false
            }

            if (checkRole(['admin', 'teacher'], user as unknown as User)) {
                return true
            }  


            // TODO QA THIS NEW FUNCTION
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
                            ],
                        }
                    })
        
                    console.log(enrollment, "enrollment")
        
                     // return enrollment ? true : false
                    if (!enrollment || enrollment.docs.length === 0) {
                        return false
                    }
        
                    console.log(enrollment.docs, "enrollment.docs")
                    const userCourses = enrollment.docs.map((enrollment) => enrollment.course).flat()

                    console.log(userCourses, "userCourses")
                    
                    for (let i = 0; i < userCourses.length; i++) {
                        const course = userCourses[i];
                        // check if course has lesson]
                        console.log(course, "course")
                        
                        if (course.lessons) {
                            // check if lesson has id
                            console.log(course.lessons, "course.lessons")

                            const isLessonInCourse = course.lessons.find((lesson: any) => lesson.id === id)

                            console.log(isLessonInCourse, "isLessonInCourse")

                            if (isLessonInCourse) {
                                return {
                                    id: {
                                        equals: id
                                    }
                                }
                            }
                        } else {
                            continue
                        }
                    }

                    return false

                } catch (error) {
                    console.log(error)
                    return false
                }
            }

            return findIfUserIsEnrolled()
        
        },
        update: isAdminOrCreatedBy,
        delete: isAdmin
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre de la lección',
        },
        {
            name: 'description',
            type: 'text',
            required: true,
            label: 'Descripción de la lección',
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
            name: 'content',
            type: 'richText',
            required: true,
            label: 'Contenido',
        },
        {
            name: 'resources',
            type: 'array',
            label: 'Recursos',
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    label: 'Nombre del recurso',
                },
                {
                    name: 'description',
                    type: 'richText',
                    required: true,
                    label: 'Descripción del recurso',
                },
            ],
        },
        {
            name: 'completedBy',
            type: 'relationship',
            relationTo: 'users',
            label: 'Completado por',
            hasMany: true,
            hooks: {
                afterChange: [
                    async ({ req, operation, originalDoc }) => {
                        if (operation === 'update') {
                            
                            const { payload, user } = req

                            if (!user) {
                                return
                            }
                            
                            const score = originalDoc.score 
                            try {
                                const [updatedUser] = await addScoreToUser(score, user, payload)
                                console.log(updatedUser)
                                return
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    }
                ]
            }
        },
        {
            name: 'score',
            type: 'number',
            label: 'Puntaje',
            defaultValue: 10,
        },
        {
            name: 'order',
            type: 'number',
            label: 'Orden numérico de la lección',
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
                const [updatedLesson, error] = await completedBy({
                    collection: 'lessons',
                    id: req.params.id,
                    user: req.user,
                    payload: req.payload,
                    
                })

                if (error) {
                    return res.status(error.status).json({
                        message: error.message,
                        error
                    })
                }
                
                res.status(200).json(updatedLesson)
            }
        },
    ]
}

export default Lessons;
