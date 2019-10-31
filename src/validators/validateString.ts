import { getType } from './helpers';

interface StringOptions {
	minLength?: number;
	maxLength?: number;
	match?: RegExp;
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
export default function validateString(prop: string, options: StringOptions, value: any): boolean {
	const { minLength, maxLength, match, required = true, validate } = options;

	if (typeof value === 'undefined') {
		if (required)
			throw new Error(`Property ${prop} is defined on the schema but it is missing on the provided data.`);
		else return true;
	}

	if (typeof value !== 'string') {
		throw new Error(`Type of ${prop} is expected to be a string, ${getType(value)} found instead.`);
	}

	if (typeof minLength !== 'undefined' && value.length < minLength) {
		throw new Error(
			`String ${prop} needs to be at least ${minLength} characters long, ${value.length} characters found.`
		);
	}

	if (typeof maxLength !== 'undefined' && value.length > maxLength) {
		throw new Error(
			`String ${prop} can contain maximum of ${maxLength} characters, ${value.length} characters found.`
		);
	}

	if (match && !value.match(match)) {
		throw new Error(`String ${prop} does not match required regex format ${match}, string ${value} found.`);
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
