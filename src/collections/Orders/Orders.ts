import payload from 'payload';
import { CollectionConfig } from 'payload/types';
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
import { User } from '../../payload-types';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.

const Orders: CollectionConfig = {
    slug: 'orders',
    admin: {
        useAsTitle: 'id',
        hidden(args) {
            const {  user  } = args
            return !checkRole(['admin', 'editor'], user as unknown as User)
        },
    },
    access: {
        create: anyone,
        read: (data) => {
            const { req: { user } } = data
            return checkRole(['admin', 'editor', 'teacher'], user) || isSelfStudent(data)
        },
        update: ({ req: { user } }) => {
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' })
        },
        delete: isAdmin
    },
    fields: [
        // {
        //     name: 'amount',
        //     type: 'number',
        //     required: true,
        // },
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
        },
        {
            name: 'customer',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
        },
        {
            name: 'products',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
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
        },
        {
            name: 'details',
            type: 'richText',
            label: 'Detalles',
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
            hooks: {
                beforeChange: [
                    ({ siblingData }) => {
                        // ensures data is not stored in DB
                        delete siblingData['total']
                    }
                ],
                afterRead: [
                    async ({ data }) => {
                        // search for the total in the products
                        const { products } = data
                        let total = 0
                        let currency = ''
                    
                        for (const product of products) {

                            const productsData = await payload.findByID({
                                collection: 'products',
                                id: product
                            })

                            const productPrice = productsData.productPrice[0].price
                            const productCurrency = productsData.productPrice[0].aceptedCurrency
                            total += productPrice
                            currency = productCurrency
                        }
                        return `${total} ${currency}`
                    }
                ],
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
    }
}

export default Orders;