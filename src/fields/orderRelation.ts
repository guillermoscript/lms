import deepMerge from '../utilities/deepMerge'
import type { Field } from 'payload/types'

export default function orderRelation(overrides = {}) {
    return deepMerge<Field, Partial<Field>>({
        name: "order",
        type: "relationship",
        relationTo: "orders",
        hasMany: false,
        label: "Orden",
    }, overrides)
}