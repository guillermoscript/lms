import type { Field } from 'payload/types'
import deepMerge from '../utilities/deepMerge'

export function lastModifiedBy(overrides: Partial<Field> = {}): Field {
    return deepMerge<Field, Partial<Field>>(
        {
            name: 'lastModifiedBy',
            type: 'relationship',
            relationTo: 'users',
            access: {
                update: () => false,
            },
            admin: {
                readOnly: true,
                position: 'sidebar',
                condition: data => Boolean(data?.lastModifiedBy)
            },
        }, overrides)
}