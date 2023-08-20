import { CollectionConfig } from 'payload/types';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { createdByField } from '../fields/createdBy';
import { lastModifiedBy } from '../fields/lastModifiedBy ';
import { populateCreatedBy } from '../hooks/populateCreatedBy';
import { populateLastModifiedBy } from '../hooks/populateLastModifiedBy';
import { slugField } from '../fields/slug';
import { anyone } from '../access/anyone';
import addScoreToUser from '../services/addScoreToUser';
import { Comment } from '../payload-types';


const Comments: CollectionConfig = {
    slug: 'comments',
    admin: {
        useAsTitle: 'id',
        group: 'Comentarios',
    },
    access: {
        create: anyone,
        read: anyone,
        update: isAdminOrCreatedBy,
        delete: isAdminOrCreatedBy
    },
    fields: [
        {
            name: 'comment',
            type: 'textarea',
            required: true,
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
        },
        {
            name: 'likes',
            type: 'number',
            required: false,
        },
        {
            name: 'dislikes',
            type: 'number',
            required: false,
        },
        {
            name: 'commentable',
            type: 'relationship',
            relationTo: ['products', 'lessons', 'courses', 'comments', 'evaluations'],
            hasMany: false,
        },
        createdByField(),
        lastModifiedBy(),
        slugField('id')
    ],
    hooks: {
        beforeChange: [
            populateCreatedBy,
            populateLastModifiedBy,
        ],
        afterChange: [
            async ({ req, operation }) => {
                if (operation === 'create') {
                    
                    const { payload, user } = req

                    if (!user) {
                        return
                    }
                    
                    // for now a static score
                    const score = 4 
                    try {
                        const [updatedUser] = await addScoreToUser(score, user, payload)
                        console.log(updatedUser)
                        return
                    } catch (error) {
                        console.log(error)
                    }
                }
            },

            async ({ req, operation, doc }) => {
                if (operation !== 'create') {
                    return
                }
                const comment = doc as Comment
                const { user, payload } = req

                const relationTo = comment?.commentable?.relationTo
                const id = comment?.commentable?.value?.id as string

                if (!relationTo || !id) {
                    return
                }

                if (relationTo === 'products' || relationTo === 'courses') {
                    return
                }


                const [commentable, commentableError] = await payload.findByID({
                    collection: relationTo,
                    id: id,
                })

                if (commentableError) {
                    console.log(commentableError, "commentableError")
                    return
                }

                const [notification, notificationError] = await payload.create({
                    collection: 'notifications',
                    data: {
                        recipient: commentable?.createdBy,
                        type: 'comment',
                        status: 'active',
                        message: `${user?.firstName} ${user?.lastName} ha comentado en tu ${relationTo}`,
                        read: false,
                    }
                })

                if (notificationError) {
                    console.log(notificationError)
                    return
                }

                return doc
            }
        ]
    }
};

export default Comments;