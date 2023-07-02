import { CollectionConfig, PayloadRequest } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { isEnrolledOrHasAccess } from '../access/isEnrolledOrHasAccess';
import orderRelation from '../fields/orderRelation';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { checkRole } from './Users/checkRole';
import { Enrollment, Subscription, User } from '../payload-types';
import { Response } from 'express';
import { PaginatedDocs } from 'payload/dist/mongoose/types';
import { z } from 'zod';
import tryCatch from '../utilities/tryCatch';
import { isLoggedIn } from '../access/isLoggedIn';
import { StatusCodes } from 'http-status-codes';

async function getActiveEnrollments(req: PayloadRequest, res: Response) {
    
    const user = req.user as User;
    if (!user) {
        return [null, { message: 'Missing user id' }]
    }

    // find user
    const [userEnrollemnt, userError] = await tryCatch<PaginatedDocs<Subscription>>(req.payload.find({
        collection: 'enrollments',
        where: {
            and: [
                {
                    student: {
                        equals: user?.id
                    }
                },
                {
                    status: {
                        equals: 'active'
                    }
                }
            ]
        },
        sort: '-createdAt',
    }));

    console.log(userEnrollemnt, "userEnrollemnt")

    if (userError || !userEnrollemnt) {
        return [null, userError]
    }

    if (userEnrollemnt?.docs.length === 0) {
        return [null, { message: 'No Enrollment found' }]
    }

    // send response that user has active subscription
    return [userEnrollemnt, null]
}


// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Enrollments: CollectionConfig = {
    slug: 'enrollments',
    admin: {
        useAsTitle: 'id',
        hidden(args) {
            const {  user  } = args
            return !checkRole(['admin', 'editor'], user as unknown as User)
        },
        group: 'Información de usuarios',
    },
    access: {
        create: ({ req: { user } }) => {
            if (checkRole(['admin', 'editor', 'teacher'], user)) {
                return true
            }
            // TODO: let a user type student enroll in a course
            return false
        },
        read: ({ req: { user } }) => {
            if (!user) {
                return false
            }
            if (checkRole(['admin', 'editor', 'teacher'], user)) {
                return true
            }

            return {
                student: {
                    equals: user.id
                }
            }

        }, 
        // read: ({ req: { user } }) => isEnrolledOrHasAccess(['admin', 'editor', 'teacher'], user),
        update: isAdminOrEditor,
        delete: isAdminOrEditor
    },
    fields: [
        {
            name: 'student',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
            label: 'Estudiante',
        },
        {
            name: 'products',
            type: 'relationship',
            relationTo: 'products',
            hasMany: false,
            label: 'Producto',
        },
        {
            name: 'course',
            type: 'relationship',
            relationTo: 'courses',
            hasMany: false,
        },
        {
            name: 'status',
            type: 'radio',
            options: [ // required
                {
                    label: 'Activo',
                    value: 'active',
                },
                {
                    label: 'Inactivo',
                    value: 'inactive',
                },
            ],
        },
        orderRelation()
    ],
    endpoints: [
		{
			path: '/check',
			method: 'get',
			handler: async (req, res, next) => {
                const [activeEnrollments, error] = await getActiveEnrollments(req, res);
                
                res.status(200).json({ message: 'User has active enrollment' });
            }
			
		},
        {
            path: '/actives/:courseId',
            method: 'get',
            handler: async (req, res, next) => {
                
                const user = req.user as User;
                const courseId = req.params.courseId;
                if (!user) {
                    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing user id' })
                }

                if (!courseId) {
                    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing course id' })
                }                

                // find user
                const [userEnrollemnt, userError] = await tryCatch<PaginatedDocs<Enrollment>>(req.payload.find({
                    collection: 'enrollments',
                    where: {
                        and: [
                            {
                                student: {
                                    equals: user?.id
                                }
                            },
                            {
                                status: {
                                    equals: 'active'
                                }
                            },
                            {
                                course: {
                                    equals: courseId
                                }
                            }
                        ]
                    },
                    sort: '-createdAt',
                }));

                if (userError || !userEnrollemnt) {
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error finding user enrollment' })
                }

                if (userEnrollemnt?.docs.length === 0) {
                    return res.status(StatusCodes.NOT_FOUND).json({ message: 'No Enrollment found' })
                }

                // filter by course id
                // send response that user has active subscription
                const course = userEnrollemnt?.docs[0].course;

                console.log(course, "course")
                
                res.status(200).json(course);
            }
        },
        {
            path: '/course/:id/evaluations',
            method: 'get',
            handler: async (req, res) => {

                const { id } = req.params

                const evaluations = await req.payload.find({
                    collection: 'evaluations',
                    where: {
                        course: {
                            equals: id
                        }
                    }
                })

                if (!evaluations || evaluations.docs.length === 0) {
                    return res.status(404).json({
                        message: 'No evaluations found'
                    })
                }

                return res.status(200).json(evaluations)
            },
        }
	],
}

export default Enrollments;