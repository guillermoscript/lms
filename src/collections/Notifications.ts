import { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';
import { User } from '../payload-types';
import { checkRole } from './Users/checkRole';
import { anyone } from '../access/anyone';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { adminEmail, noReplyEmail } from '../utilities/consts';

const Notifications: CollectionConfig = {
    slug: 'notifications',
    admin: {
        useAsTitle: 'name',
        hidden(args) {
            const {  user  } = args
            return !checkRole(['admin', 'editor'], user as unknown as User)
        },
    },
    access: {
        create: anyone,
        read: ({ req: { user } }) => {
            
            if (!user) return false;

            if (user.roles?.includes('admin')) return true;

            return {
                recipient: {
                    equals: user.id,
                },
            };
        },
        update: anyone,
        delete: isAdminOrEditor
    },
    fields: [
        {
            name: 'recipient',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
            label: 'Mensaje',
        },
        {
            name: 'status',
            type: 'radio',
            required: true,
            defaultValue: 'active',
            options: [
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
            name: 'type',
            type: 'radio',
            required: true,
            options: [
                {
                    label: 'comentario',
                    value: 'comment',
                },
                {
                    label: 'like',
                    value: 'like',
                },
                {
                    label: 'compartir',
                    value: 'share',
                },
                {
                    label: 'seguir',
                    value: 'follow',
                },
                {
                    label: 'mencion',
                    value: 'mention',
                },
                {
                    label: 'mensaje',
                    value: 'message',
                },
                {
                    label: 'pedido',
                    value: 'order',
                },
                {
                    label: 'pago',
                    value: 'payment',
                },
                {
                    label: 'Evaluacion',
                    value: 'evaluation',
                },
                {
                    label: 'Solicitud',
                    value: 'request',
                },
                {
                    label: 'Notificacion',
                    value: 'notification',
                },
                {
                    label: 'Otro',
                    value: 'other',
                },
            ],
        },
        {
            name: 'read',
            type: 'checkbox',
            required: true,
            defaultValue: false,
            label: 'Leido',
        },
        lastModifiedBy(),
        createdByField(),
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy,
        ],
        // TODO: not sure if i will leave this here
        // afterChange: [
        //     async ( { req,  operation, doc } ) => {
        //         if (operation === 'create') {
        //             const { user, payload } = req
        //             const type = doc.type
        //             if (user) {
        //                 payload.sendEmail({
        //                     from: noReplyEmail,
        //                     to: user.email,
        //                     subject: 'Nueva notificacion',
        //                     html: `<h1>Nueva notificacion</h1><p>Has recibido una nueva notificacion de tipo ${type}</p>`
        //                 })
        //             }
        //         }
        //     }
        // ]
    }
}

export default Notifications;