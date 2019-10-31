import { getType } from './helpers';

interface BooleanOptions {
	required?: boolean;
	validate?: (prop: string, val: any) => void;
}

/**
 * Validates a string with provided options
 * 
 * @param { string } prop name of the property to check
 * @param { object } options options object
 * @param { any } value value to check
 * @returns { void }
 */
export default function validateBoolean(prop: string, options: BooleanOptions, value: any) {
	const { required = true, validate } = options;

	if (typeof value === 'undefined') {
		if (required)
			throw new Error(`Property ${prop} is defined on the schema but it is missing on the provided data.`);
		else return true;
	}

	if (typeof value !== 'boolean') {
		throw new Error(`Type of ${prop} is expected to be a boolean, ${getType(value)} found instead.`);
	}

	if (validate) {
		if (typeof validate === 'function') validate(prop, value);
		else
			throw new Error(
				`Validator for the property ${prop} should be a function, ${getType(validate)} found instead.`
			);
	}

	return true;
}
