import type { Field } from 'payload/types'
import deepMerge from '../utilities/deepMerge'

export function isPublicField(overrides: Partial<Field> = {}): Field {
  return deepMerge<Field, Partial<Field>>(

    {
        name: 'isPublic',
        type: 'checkbox',
        label: 'Es Publico',
    }, overrides)
}