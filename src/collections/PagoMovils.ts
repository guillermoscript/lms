import { CollectionConfig } from 'payload/types';
import VenezuelanBanks from '../fields/VenezuelanBanks';
import { isAdminOrSelf } from '../access/isAdminOrSelf';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const PagoMovils: CollectionConfig = {
    slug: 'pago-movil',
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
        // VenezuelanBanks(),
        {
            name: 'bank',
            type: 'radio',
            options: [
                {
                    label: 'Banco de Venezuela',
                    value: 'banco-de-venezuela',
                },
                {
                    label: 'Banco Mercantil',
                    value: 'banco-mercantil',
                },
                {
                    label: 'Banco Provincial',
                    value: 'banco-provincial',
                },
                {
                    label: 'Banco Bicentenario',
                    value: 'banco-bicentenario',
                },
                {
                    label: 'Banco Exterior',
                    value: 'banco-exterior',
                },
                {
                    label: 'Banco Occidental de Descuento',
                    value: 'banco-occidental-de-descuento',
                },
                {
                    label: 'Banco Sofitasa',
                    value: 'banco-sofitasa',
                },
                {
                    label: 'Banco Plaza',
                    value: 'banco-plaza',
                },
                {
                    label: 'Banco Caroní',
                    value: 'banco-caroni',
                },
                {
                    label: 'Banco Activo',
                    value: 'banco-activo',
                },
                {
                    label: 'Banco del Tesoro',
                    value: 'banco-del-tesoro',
                },
                {
                    label: 'Banco Agrícola de Venezuela',
                    value: 'banco-agricola-de-venezuela',
                },
                {
                    label: 'Banco de la Fuerza Armada Nacional Bolivariana',
                    value: 'banco-de-la-fuerza-armada-nacional-bolivariana',
                },
                {
                    label: 'Banco del Pueblo Soberano',
                    value: 'banco-del-pueblo-soberano',
                },
                {
                    label: 'Banco Nacional de Crédito',
                    value: 'banco-nacional-de-credito',
                },
                {
                    label: 'Banco Venezolano de Crédito',
                    value: 'banco-venezolano-de-credito',
                },
                {
                    label: 'Banesco',
                    value: 'banesco',
                }
            ]
        },
        {
            name: 'idn',
            type: 'number',
            required: true,
            label: 'Cédula de identidad',
        },
        // {
        //     name: 'referenceNumber',
        //     type: 'text',
        //     required: true,
        //     label: 'Número de referencia',
        // }
    ],
}

export default PagoMovils;