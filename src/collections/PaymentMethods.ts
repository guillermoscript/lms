import { CollectionConfig } from 'payload/types';
import { isAdminOrSelf } from '../access/isAdminOrSelf';
import { createdByField } from '../fields/createdBy';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const PaymentMethods: CollectionConfig = {
    slug: 'payment-methods',
    admin: {
        useAsTitle: 'id'
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
            name: 'paymentMethodType',
            type: 'relationship',
            label: 'Tipo de pago',
            relationTo: [
                'zelles', 
                // 'paypal', 
                'pago-movils', 
                // 'cash', 
                // 'bank-transfer'
            ],
        },
        createdByField()
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy
        ]
    }
}

export default PaymentMethods;