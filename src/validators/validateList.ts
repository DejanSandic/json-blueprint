import validateValue from './validateValue';
import validateObject from './validateObject';
import validateArray from './validateArray';
import validateMap from './validateMap';
import { isTypeConstructor, getType } from './helpers';

// Only way for jest to track recursive calls is for the
// validateList to be imported into its own scope
import * as self from './validateList';

interface ListOptions {
   required?: boolean;
   validate?: (prop: string, val: any) => void;
   minLength?: number;
   maxLength?: number;
}

/**
 * Function for validating BlueprintLists
 * BlueprintList: (array which has properties with defined types)
 * @param { string | null } prop
 * @param { Object } blueprint
 * @param { object } options options object
 * @param { Object } obj
 */
export default function validateList (parentProp: string, validator: any, options: ListOptions = {}, data: any) {
   const { required = true, minLength, maxLength, validate } = options;

   // Throw an error if validator is not constructor, object or array
   const invalid = !isTypeConstructor(validator) && !Array.isArray(validator) && getType(validator) !== 'object';
   if (invalid) {
      throw new Error(
         `Unsuported blueprint type for the property '${parentProp}' (${getType(validator)}).` +
            ` Check the documentation for the supported blueprint types.`
      );
   }

   // Throw an error if data is not provided
   if (typeof data === 'undefined') {
      if (required) {
         throw new Error(`Property ${parentProp} is defined on the blueprint but it is missing on the provided data.`);
      } else return true;
   }

   // Throw an error if the provided data is not an array
   if (!Array.isArray(data)) {
      throw new Error(
         `Data passed for the property ${parentProp} is suposed to be an Array, ` + `${getType(data)} found instead.`
      );
   }

   // Validate the length of the data
   if (typeof minLength !== 'undefined' && data.length < minLength) {
      throw new Error(`Array ${parentProp} needs to have at least ${minLength} items, ${data.length} items found.`);
   } else if (typeof maxLength !== 'undefined' && data.length > maxLength) {
      throw new Error(`Array ${parentProp} can contain maximum of ${maxLength} items, ${data.length} items found.`);
   }

   // Invoke validator function if provided
   if (validate) {
      if (typeof validate === 'function') validate(parentProp, data);
      else {
         throw new Error(
            `Validator for the property ${parentProp} should be a function, ${getType(validate)} found instead.`
         );
      }
   }

   // Create prop for the array
   const prop = `the ${parentProp} array item`;

   /**
    * If validator is constructor (String, Object, etc.)
    * pass the prop, validator, empty options object and each item
    * in the data array and to the validateValue() function
    */
   if (isTypeConstructor(validator)) {
      data.forEach((value: any) => {
         validateValue(prop, validator, {}, value);
      });
      return;
   }

   /**
    * If validator is an object which has type property which is
    * the constructor, destructure constructor and options object
    * from it and pass them with each item in the dataarray to the
    * validateValue() function
    */
   if (isTypeConstructor(validator.type)) {
      const { type, ...options } = validator;
      data.forEach((value: any) => {
         validateValue(prop, type, options, value);
      });
      return;
   }

   /**
    * If validator is an array, go through each item in the data array, check
    * is it an array and if it is pass it to the validateList() function
    */
   if (Array.isArray(validator)) {
      data.forEach((value: any) => {
         validateArray(prop, {}, value);
         return self.default(prop, validator[0], {}, value);
      });
      return;
   }

   /**
    * If validator is an object, go through each item in the data array, check is
    * it an object and if it is pass it to the validateMap() function
    */
   if (getType(validator) === 'object') {
      data.forEach((value: any) => {
         validateObject(prop, {}, value);
         validateMap(prop, validator, {}, value);
      });
   }
}
