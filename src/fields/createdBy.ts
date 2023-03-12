import type { Field } from 'payload/types'
import deepMerge from '../utilities/deepMerge'

export function createdByField(overrides: Partial<Field> = {}): Field {
  return deepMerge<Field, Partial<Field>>(
    {
        name: 'createdBy',
        type: 'relationship',
        relationTo: 'users',
        access: {
          update: () => false,
        },
        admin: {
          readOnly: true,
          position: 'sidebar',
          condition: data => Boolean(data?.createdBy)
        },
    }, overrides)
}