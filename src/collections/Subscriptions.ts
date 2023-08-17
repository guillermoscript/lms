import { CollectionConfig, PayloadRequest } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import periodicity from '../fields/periodicity';
import orderRelation from '../fields/orderRelation';
import { checkRole } from './Users/checkRole';
import tryCatch from '../utilities/tryCatch';
import { Subscription } from '../payload-types';
import { PaginatedDocs } from 'payload/dist/mongoose/types';
import { z } from 'zod';
import { Response } from 'express';

async function getActiveSubscriptions(req: PayloadRequest, res: Response) {
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
    const [userSubscriptions, userError] = await tryCatch<PaginatedDocs<Subscription>>(req.payload.find({
        collection: 'subscriptions',
        where: {
            and: [
                {
                    'user': {
                        equals: id
                    }
                },
                {
                    'status': {
                        equals: 'active'
                    }
                }
            ]
        },
        sort: '-createdAt',
    }));

    if (userError || !userSubscriptions) {
        return [null, userError]
    }

    if (userSubscriptions?.docs.length === 0) {
        return [null, { message: 'No Subscription found' }]
    }

    // send response that user has active subscription
    return [userSubscriptions, null]
}

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Subscriptions: CollectionConfig = {
    slug: 'subscriptions',
    admin: {
        useAsTitle: 'id',
        group: 'Información de usuarios',
    },
    access: {
        create: ({ req: { user } }) => {
            if (checkRole(['admin', 'editor', 'teacher'], user)) {
                return true
            }
            // TODO: let a user type student enroll in a course, this will be needed for the checkout process with automatic enrollment
            
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
                'user': {
                    equals: user.id
                }
            }
        },
        update: isAdminOrEditor,
        delete: isAdminOrEditor
    },
    fields: [
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
        {
            name: 'startDate',
            type: 'date',
            required: true,
            label: 'Fecha de inicio',
        },
        {
            name: 'endDate',
            type: 'date',
            required: true,
            label: 'Fecha de finalización',
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
        },
        {
            name: 'product',
            type: 'relationship',
            relationTo: 'products',
            hasMany: false,
        },
        {
            name: 'plan',
            type: 'relationship',
            relationTo: 'plans',
            hasMany: false,
        },
        periodicity(),
        orderRelation(),
        // slugField('user'),
    ],
    hooks: {
        beforeChange: [
            // populateCreatedBy,
            // populateLastModifiedBy,
            
        ],
    },
    endpoints: [
		{
			path: '/:id/check',
			method: 'get',
			handler: async (req, res, next) => {
                const [activeSubscriptions, error] = await getActiveSubscriptions(req, res);
                
                if (error) {
                    return res.status(400).json(error);
                }

                res.status(200).json({ message: 'User has active subscription'});
            }
			
		},
        {
            path: '/:id/actives',
            method: 'get',
            handler: async (req, res, next) => {
                const activeSubscriptions = await getActiveSubscriptions(req, res);
                res.status(200).json(activeSubscriptions);
            }
        }
	],
}

export default Subscriptions;