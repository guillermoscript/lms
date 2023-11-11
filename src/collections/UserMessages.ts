import { CollectionConfig, PayloadRequest } from 'payload/types';
import { isAdminOrEditor } from '../access/isAdminOrEditor';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';
import { User } from '../payload-types';
import { checkRole } from '../access/checkRole';


const hasAccessOrIsOwner = ({ req, doc }: { req: PayloadRequest, doc: any }) => {
    const { user } = req

    if (!user) return false

    if (checkRole(['admin', 'editor'], user as unknown as User)) return true

    return {
        'chat.users': {
            in: [user.id]
        }
    }
}

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const UserMessages: CollectionConfig = {
    slug: 'user-messages',
    admin: {
        useAsTitle: 'name',
        hidden(args) {
            const { user } = args
            return !checkRole(['admin', 'editor'], user as unknown as User)
        },
        group: 'Información de chats',
    },
    access: {
        create: async ({ req: { user, payload }, id }) => {
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
        read: hasAccessOrIsOwner,
        update: hasAccessOrIsOwner,
        delete: hasAccessOrIsOwner
    },
    fields: [
        {
            name: 'chat',
            type: 'relationship',
            relationTo: 'chats',
            hasMany: false,
            required: true,
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
            required: true,
        },
        {
            name: 'type',
            type: 'select',
            options: [
                {
                    label: 'Texto',
                    value: 'text'
                },
                {
                    label: 'Imagen',
                    value: 'image'
                },
                {
                    label: 'Audio',
                    value: 'audio'
                },
                {
                    label: 'ai',
                    value: 'ai'
                }
                // TODO: Implementar estos tipos de mensajes
                // {
                //     label: 'Video',
                //     value: 'video'
                // },
                // {
                //     label: 'Documento',
                //     value: 'document'
                // },
                // {
                //     label: 'Ubicación',
                //     value: 'location'
                // },
            ],
            required: true,
        },
        {
            name: 'ai',
            type: 'textarea',
            required: false,
            admin: {
                condition: (_, siblingData) => siblingData.type === 'text'
            }
        },
        {
            name: 'text',
            type: 'textarea',
            required: false,
            admin: {
                condition: (_, siblingData) => siblingData.type === 'text'
            }
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'medias',
            required: false,
            admin: {
                condition: (_, siblingData) => siblingData.type === 'image'
            }
        },
    ],
    hooks: {
        beforeChange: [
            ({ data, req, operation }) => {
                if (operation === 'create') {
                    if (req.user) {
                        data.user = req.user.id;
                        return data;
                    }
                }

                return data
            },
        ],
        // afterChange: [
        //     async ({ doc, req, operation }) => {
        //         if (operation === 'create' && doc.type === 'audio') {
        //             try {
        //                 const botMessage = await axios.post('http://localhost:3000/api/audio/upload',{
        //                     chatId: doc.chat,
        //                     audioId: doc.audio
        //                 })
        //                 const botMessageText = botMessage.data

        //                 console.log(botMessageText)
        //                 return doc
        //             } catch (error) {
        //                 console.log(error)
        //             }
        //         }

        //         return doc
        //     },
        // ]
    },
    endpoints: [
        {
            path: '/chat/:id/messages',
            method: 'get',
            handler: async (req, res) => {
                const { user, payload } = req
                const { id } = req.params

                console.log(id, '<----------- id')
                if (!user) {
                    res.status(401).send('Unauthorized')
                    return
                }

                if (!id) {
                    res.status(400).send('Bad request')
                    return
                }

                try {
                    const messages = await payload.find({
                        collection: 'user-messages',
                        where: {
                            chat: {
                                equals: id
                            }
                        },
                        user: user.id,
                        sort: '--createdAt'
                    })

                    if (!messages) {
                        res.status(404).send('Chat not found')
                        return
                    }

                    res.status(200).send(messages)
                } catch (error) {
                    console.log(error)
                    res.status(500).send('Internal server error')
                }
            }
        },
    ]
}

export default UserMessages;