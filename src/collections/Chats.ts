import { CollectionConfig } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';
import { User } from '../payload-types';
import { checkRole } from '../access/checkRole';
import { hasAccessOrIsSelf } from '../access/hasAccessOrIsSelf';


// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Chats: CollectionConfig = {
    slug: 'chats',
    admin: {
        useAsTitle: 'name',
        hidden(args) {
            const {  user  } = args
            return !checkRole(['admin', 'editor'], user as unknown as User)
        },
        group: 'Información de chats',
    },
    access: {
        create: async ({req: { user, payload }, id}) => {

            console.log(user)
            if (!user) return false

            if (checkRole(['admin', 'editor'], user as unknown as User)) return true

            try {

                const userSubscriptions = await payload.find({
                    collection: 'subscriptions',
                    where: {
                        user: {
                            equals: user.id
                        }
                    }
                })


                if (userSubscriptions.docs.length > 0) {
                    return true
                } else {
                    return false
                }
            } catch (error) {
                console.log(error)
                return false
            }
        },
        read :hasAccessOrIsSelf,
        update: hasAccessOrIsSelf,
        delete: hasAccessOrIsSelf
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nombre del chat',
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Descripción del chat',
        },
        {
            name: 'users',
            type: 'relationship',
            relationTo: 'users',
            hasMany: true,
        },
        {
            name: 'type',
            type: 'select',
            defaultValue: 'bot',
            options: [
                {
                    label: 'Grupo',
                    value: 'group'
                },
                {
                    label: 'Privado',
                    value: 'private'
                },
                {
                    label: 'Bot',
                    value: 'bot'
                },
                {
                    label: 'Q&A Bot',
                    value: 'qa'
                }
            ],
        },
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy,
            ({ req: { user }, data, operation }) => {
                if (operation === 'create') {
                    if (user) {
                        data.users = [user.id]
                        return data;
                    }
                }
            }
        ]
    }
}

export default Chats;