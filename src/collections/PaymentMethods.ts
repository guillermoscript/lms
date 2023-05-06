import { CollectionConfig } from 'payload/types';
import { isAdminOrSelf } from '../access/isAdminOrSelf';
import { createdByField } from '../fields/createdBy';
import VenezuelanBanks from '../fields/VenezuelanBanks';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';
import { User } from '../payload-types';
import { checkRole } from './Users/checkRole';


// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const PaymentMethods: CollectionConfig = {
    slug: 'payment-methods',
    admin: {
        useAsTitle: 'title',
        hidden(args) {
            const {  user  } = args
            return !checkRole(['admin', 'editor'], user as unknown as User)
        },
    },
    access: {
        create : isAdminOrSelf,
        read : isAdminOrSelf,
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
                    value: 'pago-movil',
                },
                {
                    label: 'Efectivo',
                    value: 'cash',
                },
                {
                    label: 'Transferencia bancaria',
                    value: 'bank-transfer',
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
                    name: 'fullName',
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
                condition: (data) => data.paymentMethodType === 'pago-movil'
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
                    name: 'idn',
                    type: 'number',
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
                condition: (data) => data.paymentMethodType === 'bank-transfer'
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
    }
}

export default PaymentMethods;