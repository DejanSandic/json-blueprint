import { getType } from './helpers';

interface ArrayProperties {
	minLength?: number;
	maxLength?: number;
	required?: boolean;
	validate?: (prop: string, val: any) => void;
}

/**
 * Validates an array with provided options
 *
 * @param { string } prop name of the property to check
 * @param { object } options options object
 * @param { any } value value to check
 * @returns { void }
 */
export default function validateObject(prop: string, options: ArrayProperties, value: any) {
	const { required = true, minLength, maxLength, validate } = options;

	if (typeof value === 'undefined') {
		if (required) {
			throw new Error(`Property ${prop} is defined on the blueprint but it is missing on the provided data.`);
		} else return true;
	}

	if (!Array.isArray(value)) {
		throw new Error(`Type of ${prop} is expected to be an array, ${getType(value)} found instead.`);
	}

	if (typeof minLength !== 'undefined' && value.length < minLength) {
		throw new Error(`Array ${prop} needs to have at least ${minLength} items, ${value.length} items found.`);
	}

	if (typeof maxLength !== 'undefined' && value.length > maxLength) {
		throw new Error(`Array ${prop} can contain maximum of ${maxLength} items, ${value.length} items found.`);
	}

	if (validate) {
		if (typeof validate === 'function') validate(prop, value);
		else {
			throw new Error(
				`Validator for the property ${prop} should be a function, ${getType(validate)} found instead.`
			);
		}
	}

	return true;
}
