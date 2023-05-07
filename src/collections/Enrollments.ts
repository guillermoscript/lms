import { CollectionConfig, PayloadRequest } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { isEnrolledOrHasAccess } from '../access/isEnrolledOrHasAccess';
import orderRelation from '../fields/orderRelation';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { checkRole } from './Users/checkRole';
import { Subscription, User } from '../payload-types';
import { Response } from 'express';
import { PaginatedDocs } from 'payload/dist/mongoose/types';
import { z } from 'zod';
import tryCatch from '../utilities/tryCatch';

async function getActiveEnrollments(req: PayloadRequest, res: Response) {
    const { id } = req.params;

    if (!id) {
        return [null, { message: 'Missing user id' }]
    }

    // use zod to validate id
    const idSchema = z.string()
    const idValidation = idSchema.safeParse(id);

    if (!idValidation.success) {
        return [null, { message: 'Invalid user id' }]
    }

    // find user
    const [userEnrollemnt, userError] = await tryCatch<PaginatedDocs<Subscription>>(req.payload.find({
        collection: 'enrollments',
        where: {
            and: [
                {
                    student: {
                        equals: id
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
    },
    access: {
        create: ({ req: { user } }) => {
            if (checkRole(['admin', 'editor', 'teacher'], user)) {
                return true
            }
            // TODO: let a user type student enroll in a course
            return false
        },
        read: ({ req: { user } }) => isEnrolledOrHasAccess(['admin', 'editor', 'teacher'], user),
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
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy
        ]
    },
    endpoints: [
		{
			path: '/:id/check',
			method: 'get',
			handler: async (req, res, next) => {
                const [activeEnrollments, error] = await getActiveEnrollments(req, res);
                
                if (error) {
                    res.status(400).json(error);
                }

                res.status(200).json({ message: 'User has active enrollment' });
            }
			
		},
        {
            path: '/:id/actives',
            method: 'get',
            handler: async (req, res, next) => {
                const [activeEnrollments, error] = await getActiveEnrollments(req, res);
                
                if (error) {
                    res.status(400).json(error);
                }

                res.status(200).json(activeEnrollments);
            }
        }
	],
}

export default Enrollments;