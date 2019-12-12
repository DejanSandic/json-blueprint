import validateValue from './validateValue';
import validateList from './validateList';
import { isObject, isTypeConstructor, getType } from '../helpers';

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
export default function validateMap (parentProp: string, blueprint: Blueprint, options: MapOptions, data: any) {
   if (!isObject(options)) {
      throw new Error(
         `Options object is expected to be passed to the validateMap function, ` + `${getType(options)} found instead.`
      );
   }

   const { required = true, validate } = options;

   if (!isObject(blueprint)) {
      throw new Error(
         `Blueprint provided for the property ${parentProp} is expected to be an object, ` +
            `${getType(blueprint)} found instead.`
      );
   }

   if (typeof data === 'undefined') {
      if (required) {
         throw new Error(`Property ${parentProp} is defined on the blueprint but it is missing on the provided data.`);
      } else return true;
   }

   if (!isObject(data)) {
      throw new Error(
         `Value of the property ${parentProp} is expected to be an object, ${getType(data)} found instead.`
      );
   }

   const blueprintKeys = Object.keys(blueprint);
   const dataKeys = Object.keys(data);

   // Check does the provided object have properties not defined on the blueprint
   dataKeys.forEach(key => {
      if (!blueprintKeys.includes(key)) {
         throw new Error(`Property ${parentProp}.${key} on the provided data is not defined on the blueprint.`);
      }
   });

   // Validate values
   blueprintKeys.forEach(key => {
      const prop = `${parentProp}.${key}`;
      const validator = blueprint[key];
      const value = data[key];

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

      // If validator is an array pass it to the validateList() function
      if (Array.isArray(validator)) {
         return validateList(prop, validator[0], {}, value);
      }

      /**
       * If validator is an object, pass it to the validateMap() function
       */
      if (isObject(validator)) {
         return self.default(prop, validator, {}, value);
      }

      // Throw an error if validator is not function, object or array
      throw new Error(
         `Unsuported blueprint type for the property ${prop} (${getType(validator)}).` +
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
