import type { Field } from 'payload/types'
import deepMerge from '../utilities/deepMerge'

export function categoryField(overrides: Partial<Field> = {}): Field {
    return deepMerge<Field, Partial<Field>>({
        name: 'category',
        type: 'relationship',
        relationTo: 'categories',
        // admin: {
        //     useAsTitle: 'name'
        // },
        required: true,
        hasMany: true,
    }, overrides)
}
