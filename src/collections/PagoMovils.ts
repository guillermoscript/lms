import { CollectionConfig } from 'payload/types';
import VenezuelanBanks from '../fields/VenezuelanBanks';
import { isAdminOrSelf } from '../access/isAdminOrSelf';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const PagoMovils: CollectionConfig = {
    slug: 'pago-movils',
    admin: {
        useAsTitle: 'idn',
    },
    access: {
        create : isAdminOrSelf,
        read : isAdminOrSelf,
        update : isAdminOrSelf,
        delete : isAdminOrSelf
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
        // {
        //     relationTo: 'payment-methods',
        //     name: 'paymentMethod',
        //     type: 'relationship',
        //     hasMany: false,
        //     label: 'Método de pago',

        // }
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy
        ]
    }
}

export default PagoMovils;