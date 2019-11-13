import { getType } from './helpers';

interface NumberOptions {
   min?: number;
   max?: number;
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
export default function validateNumber (prop: string, options: NumberOptions, value: any): boolean {
   const { min, max, required = true, validate } = options;

   if (typeof value === 'undefined') {
      if (required) {
         throw new Error(`Property ${prop} is defined on the blueprint but it is missing on the provided data.`);
      } else return true;
   }

   if (typeof value !== 'number') {
      throw new Error(`Type of ${prop} is expected to be a number, ${getType(value)} found instead.`);
   }

   if (typeof min !== 'undefined' && value < min) {
      throw new Error(`Number ${prop} can have maximum value of ${min}, ${value} found.`);
   }

   if (typeof max !== 'undefined' && value > max) {
      throw new Error(`Number ${prop} can have maximum value of ${max}, ${value} found.`);
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
