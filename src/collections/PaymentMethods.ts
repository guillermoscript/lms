import { CollectionConfig } from 'payload/types';
import { createdByField } from '../fields/createdBy';
import VenezuelanBanks from '../fields/VenezuelanBanks';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';
import { PaymentMethod, User } from '../payload-types';
import { checkRole } from './Users/checkRole';
import tryCatch from '../utilities/tryCatch';
import { StatusCodes } from 'http-status-codes';
import { PaginatedDocs } from 'payload/dist/mongoose/types';

const isAdminOrSelf: any = ({ req: { user } }: any) => {

    if (!user) {
        return false
    }

    if (user.roles?.includes('admin')) {
        return true
    }

    return {
        paymentsOfUser: {
            equals: user.id
        }
    }
}


// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const PaymentMethods: CollectionConfig = {
    slug: 'payment-methods',
    admin: {
        useAsTitle: 'title',
        hidden(args) {
            const {  user  } = args
            return !checkRole(['admin', 'editor'], user as unknown as User)
        },
        group: 'Información de usuarios',
    },
    access: {
        create: isAdminOrSelf,
        read: isAdminOrSelf,
        update : isAdminOrSelf,
        delete : isAdminOrSelf
    },
    fields: [
        {
            name: 'paymentsOfUser',
            type: 'relationship',
            label: 'Usuario',
            relationTo: 'users',
            hasMany: true,
        },
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Título',
        },
        {
            name: 'paymentMethodType',
            type: 'radio',
            required: true,
            label: 'Tipo de pago',
            options: [
                {
                    label: 'Zelle',
                    value: 'zelle',
                },
                {
                    label: 'Paypal',
                    value: 'paypal',
                },
                {
                    label: 'Pago móvil',
                    value: 'pagoMovil',
                },
                {
                    label: 'Efectivo',
                    value: 'cash',
                },
                {
                    label: 'Transferencia bancaria',
                    value: 'bankTransfer',
                },
            ],
        },
        {
            name: 'zelle',
            type: 'group',
            label: 'Zelle',
            admin: {
                condition: (data) => data.paymentMethodType === 'zelle'
            },
            fields: [
                {
                    name: 'zelleEmail',
                    type: 'text',
                    label: 'Correo electrónico de Zelle',
                },
                {
                    name: 'zelleName',
                    type: 'text',
                    label: 'Nombre completo',
                },
            ],
        },
        {
            name: 'paypal',
            type: 'group',
            admin: {
                condition: (data) => data.paymentMethodType === 'paypal'
            },
            label: 'Paypal',
            fields: [
                {
                    name: 'paypalEmail',
                    type: 'text',
                    label: 'Correo electrónico de Paypal',
                },
            ],
        },
        {
            name: 'pagoMovil',
            type: 'group',
            label: 'Pago móvil',
            admin: {
                condition: (data) => data.paymentMethodType === 'pagoMovil'
            },
            fields: [
                {
                    name: 'phoneNumber',
                    type: 'text',
                    required: true,
                    label: 'Número de teléfono',
                },
                VenezuelanBanks(),
                {
                    name: 'pagoMovilIdn',
                    type: 'text',
                    required: true,
                    label: 'Cédula de identidad',
                },
            ],
        },
        {
            name: 'cash',
            type: 'group',
            label: 'Efectivo',
            admin: {
                condition: (data) => data.paymentMethodType === 'cash'
            },
            fields: [
                {
                    name: 'cash',
                    type: 'text',
                    label: 'Efectivo',
                },
            ],
        },
        {
            name: 'bankTransfer',
            type: 'group',
            admin: {
                condition: (data) => data.paymentMethodType === 'bankTransfer'
            },
            label: 'Transferencia bancaria',
            fields: [
                {
                    name: 'accountNumber',
                    type: 'text',
                    label: 'Número de cuenta',
                },
                {
                    name: 'bankName',
                    type: 'text',
                    label: 'Nombre del banco',
                },
                {
                    name: 'accountType',
                    type: 'radio',
                    label: 'Tipo de cuenta',
                    options: [
                        {
                            label: 'Ahorro',
                            value: 'savings',
                        },
                        {
                            label: 'Corriente',
                            value: 'current',
                        },
                    ],
                },
                VenezuelanBanks(),
            ],
        },
        createdByField(),
        slugField('title'),
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy,
            
        ]
    },
    endpoints: [
        {
            method: 'get',
            path: '/user/:id',
            handler: async (req, res) => {

                const { id } = req.params;
                const user = req.user;
                console.log(user, 'user')
                
                if (!user) {
                    res.status(StatusCodes.UNAUTHORIZED).send('No se ha iniciado sesión');
                }

                if (!id) {
                    res.status(StatusCodes.BAD_REQUEST).send('No se ha especificado un id');
                }

                const [paymentMethods, error] = await tryCatch<PaginatedDocs<PaymentMethod>>(req.payload.find({
                    collection: 'payment-methods',
                    where: {
                        paymentsOfUser: {
                            equals: id
                        }
                    }
                }))

                if (error || !paymentMethods) {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "Error al obtener los métodos de pago del usuario", error});
                }

                res.send(paymentMethods?.docs);
            }
        }
    ]
}

export default PaymentMethods;