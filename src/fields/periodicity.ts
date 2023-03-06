import deepMerge from '../utilities/deepMerge'
import type { Field } from 'payload/types'

export default function periodicity(overrides = {}) {
    return deepMerge<Field, Partial<Field>>({
            name: 'periodicity',
            type: 'radio',
            options: [ // required
                {
                    label: 'Mensual',
                    value: 'monthly',
                },
                {
                    label: 'Bimestral',
                    value: 'bimonthly',
                },
                {
                    label: 'Trimestral',
                    value: 'quarterly',
                },
                {
                    label: 'Semestral',
                    value: 'biannual',
                },
                {
                    label: 'Anual',
                    value: 'annual',
                },
                {
                    label: 'Personalizado',
                    value: 'custom',
                }
            ]
    }, overrides)
}