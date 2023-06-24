/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown) {
	return item && typeof item === 'object' && !Array.isArray(item)
}

// @ts-ignore

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export default function deepMerge<T, R>(target: T, source: R): T {
	const output = { ...target }
	if (isObject(target) && isObject(source)) {
		Object.keys(source as string).forEach(key => {
			if (isObject(source[key as keyof typeof source])) {
				// @ts-expect-error
				if (!(key in target)) {
					Object.assign(output as string, { [key]: source[key as keyof typeof source] })
				} else {
					output[key as keyof typeof output] = deepMerge(target[key as keyof typeof target], source[key as keyof typeof source])
				}
			} else {
				Object.assign(output as string, { [key]: source[key as keyof typeof source] })
			}
		})
	}

	return output
}
