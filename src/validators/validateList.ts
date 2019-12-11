import validateValue from './validateValue';
import validateMap from './validateMap';
import { isTypeConstructor, isObject, getType } from './helpers';

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
export default function validateList (parentProp: string, validator: any, options: ListOptions, data: any) {
   if (!isObject(options)) {
      throw new Error(
         `Options object is expected to be passed to the validateList function, ` + `${getType(options)} found instead.`
      );
   }

   const { required = true, minLength, maxLength, validate } = options;

   // Throw an error if validator is not constructor, object or array
   const invalid = !Array.isArray(validator) && typeof validator !== 'function' && getType(validator) !== 'object';
   if (invalid) {
      throw new Error(
         `Unsuported blueprint type for the property ${parentProp} (${getType(validator)}).` +
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

   // Invoke the validator function if provided
   if (validate) {
      if (typeof validate === 'function') validate(parentProp, data);
      else {
         throw new Error(
            `Validator for the property ${parentProp} should be a function, ${getType(validate)} found instead.`
         );
      }
   }

   // Go through each item in the data array
   data.forEach((value: any, index) => {
      // Create prop for the array
      const prop = `${parentProp}[${index}]`;

      /**
       * If validator is a function
       *
       * If validator is a constructor (String, Object, etc.)
       * pass the prop, validator, empty options object and value
       * to the validateValue() function
       *
       * Else invoke the validator function with the required arguments
       */
      if (typeof validator === 'function') {
         if (isTypeConstructor(validator)) return validateValue(prop, validator, {}, value);
         return validator(prop, value, {});
      }

      /**
       * If validator is an object which has type property which is a
       * function, destructure constructor and options object from it
       *
       * If type is a constructor, invoke the validateValue() function
       *
       * Else invoke the type function with the required arguments
       */
      if (isObject(validator) && 'type' in validator) {
         const { type, ...options } = validator;

         if (typeof type === 'function') {
            if (isTypeConstructor(type)) return validateValue(prop, type, options, value);
            return type(prop, value, options);
         } else {
            throw new Error(
               `Unsuported blueprint type for the property ${prop} (${getType(type)}).` +
                  ` Check the documentation for the supported blueprint types.`
            );
         }
      }

      /**
       * If validator is an array, invoke the validateList() function
       */
      if (Array.isArray(validator)) {
         return self.default(prop, validator[0], {}, value);
      }

      /**
       * If validator is an object, the validateMap() function
       */
      return validateMap(prop, validator, {}, value);
   });
}
