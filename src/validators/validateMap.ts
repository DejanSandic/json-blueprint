import validateValue from './validateValue';
import validateObject from './validateObject';
import validateList from './validateList';
import { combinePropNames, isTypeConstructor, getType } from './helpers';

// Only way for jest to track recursive calls is for the
// validateMap to be imported into its own scope
import * as self from './validateMap';

interface MapOptions {
	required?: boolean;
	validate?: (prop: string, val: any) => void;
}

interface Blueprint {
	[key: string]: any;
}

/**
 * Function for validating SchemaMaps
 * SchemaMap: (object which has properties with defined types)
 *
 * @param { string | null } parentProp
 * @param { Object } schema blueprint for parentProp
 * @param { object } options options object
 * @param { Object } data
 */
export default function validateMap(parentProp: string, schema: Blueprint, options: MapOptions, data: any) {
	const { required = true, validate } = options;

	if (typeof data === 'undefined') {
		if (required) {
			throw new Error(`Property ${parentProp} is defined on the schema but it is missing on the provided data.`);
		} else return true;
	}

	const schemaKeys = Object.keys(schema);
	const dataKeys = Object.keys(data);

	// Check does the provided object have properties not defined on the schema
	dataKeys.forEach((key) => {
		if (!schemaKeys.includes(key)) {
			const prop = combinePropNames(parentProp, key);
			throw new Error(`Property ${prop} on the provided data is not defined on the schema.`);
		}
	});

	// Validate values
	schemaKeys.forEach((key) => {
		const prop = combinePropNames(parentProp, key);
		const validator = schema[key];
		const value = data[key];

		/**
       * If validator is constructor (String, Object, etc.)
       * pass the prop, validator, value and empty options object
       * to the validateValue() function
       */
		if (isTypeConstructor(validator)) {
			return validateValue(prop, validator, {}, value);
		}

		/**
       * If validator is an object which has type property which is
       * the constructor, destructure constructor and options object
       * from it and pass them to the validateValue() function
       */
		if (isTypeConstructor(validator.type)) {
			const { type, ...options } = validator;
			return validateValue(prop, type, options, value);
		}

		// If validator is an array pass it to the validateList() function
		if (Array.isArray(validator)) {
			return validateList(prop, validator[0], {}, value);
		}

		/**
       * If validator is an object, first check is the value object as well
       * and if it is pass it to the validateMap() function
       */
		if (typeof validator === 'object') {
			validateObject(prop, {}, value);
			return self.default(prop, validator, {}, value);
		}

		// Throw an error if validator is not constructor, object or array
		throw new Error(
			`Unsuported schema type for the property '${prop}' (${getType(validator)}).` +
				` Check the documentation for the supported schema types.`
		);
	});

	if (validate) {
		if (typeof validate === 'function') validate(parentProp, data);
		else {
			throw new Error(
				`Validator for the property ${parentProp} should be a function, ${getType(validate)} found instead.`
			);
		}
	}
}
