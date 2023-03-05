import deepMerge from '../utilities/deepMerge'
import type { Field } from 'payload/types'

export default function transactionRelation(overrides = {}) {
    return deepMerge<Field, Partial<Field>>({
        name: "transaction",
        type: "relationship",
        relationTo: "transactions",
        hasMany: false,
        label: "Transacción",
    }, overrides)
}