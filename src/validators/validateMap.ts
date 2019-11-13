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
 * Function for validating BlueprintMaps
 * BlueprintMap: (object which has properties with defined types)
 *
 * @param { string | null } parentProp
 * @param { Object } blueprint blueprint for parentProp
 * @param { object } options options object
 * @param { Object } data
 */
export default function validateMap(parentProp: string, blueprint: Blueprint, options: MapOptions, data: any) {
	const { required = true, validate } = options;

	if (typeof data === 'undefined') {
		if (required) {
			throw new Error(`Property ${parentProp} is defined on the blueprint but it is missing on the provided data.`);
		} else return true;
	}

	const blueprintKeys = Object.keys(blueprint);
	const dataKeys = Object.keys(data);

	// Check does the provided object have properties not defined on the blueprint
	dataKeys.forEach((key) => {
		if (!blueprintKeys.includes(key)) {
			const prop = combinePropNames(parentProp, key);
			throw new Error(`Property ${prop} on the provided data is not defined on the blueprint.`);
		}
	});

	// Validate values
	blueprintKeys.forEach((key) => {
		const prop = combinePropNames(parentProp, key);
		const validator = blueprint[key];
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
			`Unsuported blueprint type for the property '${prop}' (${getType(validator)}).` +
				` Check the documentation for the supported blueprint types.`
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
