import payload from 'payload';
import { StatusCodes } from 'http-status-codes';
import { CollectionConfig, PayloadRequest } from 'payload/types';
import { anyone } from '../../access/anyone';
import { isAdmin } from '../../access/isAdmin';
import { isAdminOrEditor } from '../../access/isAdminOrEditor';
import { isRole } from '../../access/isRole';
import { isSelfStudent } from '../../access/isSelfStudent';
import { createdByField } from '../../fields/createdBy';
import { lastModifiedBy } from '../../fields/lastModifiedBy ';
import { populateCreatedBy } from '../../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../../hooks/populateLastModifiedBy';
import { checkRole } from '../Users/checkRole';
import createOrderAbleAfterChange from './hooks/createOrderAbleAfterChange';
import { creationEmailNotification } from './hooks/creationEmailNotification';
import { slugField } from '../../fields/slug';
import { Order, Product, User } from '../../payload-types';
import tryCatch from '../../utilities/tryCatch';
import { PaymentMethod } from '../../payload-types';
import { Response } from 'express';
import { isSelf } from '../../access/isSelf';
import { PaginatedDocs } from 'payload/dist/mongoose/types';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.

const Orders: CollectionConfig = {
    slug: 'orders',
    admin: {
        useAsTitle: 'id',
        hidden(args) {
            const {  user  } = args
            return !checkRole(['admin', 'editor'], user as unknown as User)
        },
        group: 'Información de usuarios',
    },
    access: {
        create: anyone,
        read: ({ req: { user } }) => {

            if (!user) return false

            if (checkRole(['admin', 'editor'], user)) return true
            
            return {
                customer: {
                    equals: user.id
                }
            }
        },
        // update: ({ req: { user } }) => {
        //     return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' })
        // },
        delete: isAdmin
    },
    fields: [
        {
            name: 'amount',
            type: 'number',
            required: true,
            access: {
                update: ({ req: { user } }) => checkRole(['admin', 'editor'], user as unknown as User)
            }
        },
        {
            name: 'status',
            type: 'radio',
            defaultValue: 'inactive',
            options: [ // required
                {
                    label: 'Activo',
                    value: 'active',
                },
                {
                    label: 'Inactivo',
                    value: 'inactive',
                },
                {
                    label: 'Cancelado',
                    value: 'canceled',
                },
                {
                    label: 'Pendiente',
                    value: 'pending',
                },
                {
                    label: 'Finalizada (Solo para renovaciones)',
                    value: 'finished',
                },
                {
                    label: 'Reembolsada',
                    value: 'refunded',
                }
            ],
            hooks: {
                afterChange: [
                    createOrderAbleAfterChange
                ]
            }
        },
        {
            name: 'type',
            type: 'radio',
            defaultValue: 'order',
            options: [ // required
                {
                    label: 'Orden',
                    value: 'order',
                },
                {
                    label: 'Renovación',
                    value: 'renewal',
                },
                {
                    label: 'Matrícula',
                    value: 'enrollment',
                },
                {
                    label: 'Suscripción',
                    value: 'subscription',
                }
            ],
            access: {
                update: ({ req: { user } }) => checkRole(['admin', 'editor'], user as unknown as User)
            }
        },
        {
            name: 'customer',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
            access: {
                update: ({ req: { user } }) => checkRole(['admin', 'editor'], user as unknown as User)
            }
        },
        {
            name: 'products',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
            access: {
                update: ({ req: { user } }) => checkRole(['admin', 'editor'], user as unknown as User)
            }
        },
        {
            name: 'referenceNumber',
            type: 'text',
            label: 'Número de referencia',
        },
        {
            name: 'paymentMethod',
            type: 'relationship',
            relationTo: 'payment-methods',
            hasMany: false,
            access: {
                update: ({ req: { user } }) => checkRole(['admin', 'editor'], user as unknown as User)
            }
        },
        {
            name: 'details',
            type: 'richText',
            label: 'Detalles',
            access: {
                update: ({ req: { user } }) => checkRole(['admin', 'editor'], user as unknown as User)
            }
        },
        {
            name: 'total',
            type: 'text',
            label: 'Total',
            admin: {
                // hidden: true, // hides the field from the admin panel
            },
            access: {
                update: () => false, // prevents the field from being updated
                create: () => false, // prevents the field from being created
            },
        },
        createdByField(),
        lastModifiedBy(),
        slugField('id'),
    ],
    hooks: {
        afterChange: [
            creationEmailNotification
        ],
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy,
            
        ]
    },
    endpoints: [
		{
			path: '/new-user-order',
			method: 'post',
			handler: async (req, res, next) => {

                const { user } = req
                const { paymentMethod, product, referenceNumber, paymentMethodType, amount, customer } = req.body

                if (user) {                    
                    const [paymentMethods, error] = await tryCatch<PaginatedDocs<PaymentMethod>>(req.payload.find({
                        collection: 'payment-methods',
                        where: {
                            paymentsOfUser: {
                                equals: user.id
                            }
                        }
                    }))

                    console.log(paymentMethods)

                    if (error || paymentMethods?.docs.length === 0) {
                        console.log(paymentMethod)
                        const [paymentMethodCreated,paymentMethodCreatedError ] = await createPaymentMethodForUser(res, user, paymentMethod, paymentMethodType)
                        if (paymentMethodCreatedError) {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(paymentMethodCreatedError)
                            return
                        }
                        const [orderCreated, orderCreatedError] = await createOrder(res, paymentMethodCreated as PaymentMethod, user, product as Product, referenceNumber, amount)
                        if (orderCreatedError) {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(orderCreatedError)
                            return
                        }
                        res.status(StatusCodes.OK).send({ message: 'Orden creada correctamente', order: orderCreated })
                        return
                    }

                    const [orderCreated,orderCreatedError] = await createOrder(res, paymentMethod as PaymentMethod['id'], user, product as Product, referenceNumber, amount)
                    if (orderCreatedError) {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(orderCreatedError)
                        return
                    }
                    res.status(StatusCodes.OK).send({ message: 'Orden creada correctamente', order: orderCreated })
                    return
                } 

                guardValidationOrder(req, res, paymentMethod, product, customer)

                const [userCreated,userCreatedError ] = await createNewUser(customer, res)                
                if (userCreatedError) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(userCreatedError)
                    return
                }
                const [paymentMethodCreated, paymentMethodCreatedError] = await createPaymentMethodForUser(res, userCreated as User, paymentMethod, paymentMethodType)
                if (paymentMethodCreatedError) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(paymentMethodCreatedError)
                    return
                }
                console.log(paymentMethodCreated, '< ================= paymentMethodCreated')

                const [orderCreated, orderCreatedError] = await createOrder(res, paymentMethodCreated as PaymentMethod, userCreated as User, product as Product, referenceNumber, amount)
                if (orderCreatedError) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(orderCreatedError)
                    return
                }

                console.log(orderCreated, '< ================= orderCreated')
                res.status(StatusCodes.OK).send({ message: 'Orden creada correctamente', order: orderCreated })
            }	
		},
	],
}


async function createOrder(res: Response, paymentMethodCreated: PaymentMethod | PaymentMethod['id'], userCreated: User, product: Product, referenceNumber: string, amount: string | number) {

    const typeOrder = {
        courses: 'enrollment',
        plans: 'subscription'
    }

    const orderType = typeOrder[product.productType?.relationTo as keyof typeof typeOrder]

    const paymentMethodId = typeof paymentMethodCreated === 'string' ? paymentMethodCreated : paymentMethodCreated.id
        
    console.log(orderType , '< ================= orderType')
    const [orderCreated, orderCreatedError] = await tryCatch<Order>(payload.create({
        collection: 'orders',
        data: {
            customer: userCreated?.id as string,
            products: [product.id],
            paymentMethod: paymentMethodId,
            referenceNumber,
            status: 'inactive',
            type: orderType,
            amount: amount
        }
    }))

    if (orderCreatedError) {
        console.log(orderCreatedError, '< ================= orderCreatedError')
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error al crear la orden' })
        return [null, {
            message: 'Error al crear la orden',
            error: orderCreatedError
        }]
    }

    return [orderCreated, null]
}

async function createPaymentMethodForUser(res: Response, user: User,  paymentMethod: PaymentMethod, paymentMethodType: PaymentMethod['paymentMethodType']) {

    const [paymentMethodCreated, paymentMethodCreatedError] = await tryCatch<PaymentMethod>(payload.create({
        collection: 'payment-methods',
        data: {
            paymentMethodType,
            // user: user.id,
            paymentsOfUser: user.id,
            [paymentMethodType]: paymentMethod,
            title: 'Método de pago' + ' ' + user.firstName + ' ' + user.lastName + ' ' + paymentMethodType,
        }
    }))

    if (paymentMethodCreatedError || !paymentMethodCreated) {
        console.log(paymentMethodCreatedError)
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error al crear el método de pago' })
        return [null, {
            message: 'Error al crear el método de pago',
            error: paymentMethodCreatedError
        }]
    }

    return [paymentMethodCreated, null]
}


async function createNewUser(user: User, res: Response, next?: any) {
    const {
        firstName,
        lastName,
        email,
        phone,
        password
    } = user

    const [userCreated, userCreatedError] = await tryCatch<User>(payload.create({
        collection: 'users',
        data: {
            firstName,
            lastName,
            email,
            phone,
            password,
            role: 'user'
        }
    }))

    if (userCreatedError || !userCreated) {
        console.log(userCreatedError)
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Error al crear el usuario' })
        return [null, {
            message: 'Error al crear el usuario',
            error: userCreatedError
        }]
    }

    return [userCreated, null]
}

function guardValidationOrder(req: PayloadRequest, res: Response, paymentMethod: PaymentMethod, product: Product, customer: User) {

    if (req.method !== 'POST') {
        res.status(StatusCodes.METHOD_NOT_ALLOWED).send({ message: 'Método no permitido' })
        return
    }

    if (!customer || !paymentMethod || !product) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Faltan datos' })
        return
    }
}

export default Orders;