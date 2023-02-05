import { CollectionConfig } from 'payload/types';
import {isRole} from '../access/isRole'
import {isSelfStudent} from '../access/isSelfStudent'

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Enrollments: CollectionConfig = {
    slug: 'enrollments',
    admin: {
        useAsTitle: 'id'
    },
    access: {
        create : (data) => {
            const {req: {user}} = data
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' }) || isRole({ user, role: 'teacher' }) || isSelfStudent(data)
        },
        read: (data) => {
            const {req: {user}} = data
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' }) || isRole({ user, role: 'teacher' }) || isSelfStudent(data)
        },
        update: (data) => {
            const {req: {user}} = data
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' }) || isRole({ user, role: 'teacher' }) || isSelfStudent(data)
        },
        delete: (data) => {
            const {req: {user}} = data
            return isRole({ user, role: 'admin' }) || isRole({ user, role: 'editor' }) || isRole({ user, role: 'teacher' }) || isSelfStudent(data)
        },
    },
    fields: [
        {
            name: 'student',
            type: 'relationship',
            relationTo: 'users',
            hasMany: false,
            label: 'Estudiante',
        },
        {
            name: 'course',
            type: 'relationship',
            relationTo: 'courses',
            hasMany: false,
        },
        {
            name: 'status',
            type: 'radio',
            options: [ // required
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
            name: 'isSubscription',
            type: 'checkbox',
            defaultValue: true,
            label: 'Es suscripción',
        },
        // {
        //     name: 'subscription',
        //     type: 'relationship',
        //     relationTo: 'subscriptions',
        //     hasMany: true,
        // }
    ],
}

export default Enrollments;