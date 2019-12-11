/**
 * Function which checks is the provided valuea JavaScript
 * constructor ( String, Number, Boolean, Symbol, Object or Array )
 *
 * @param { any } value value to be tested
 */
export function isTypeConstructor (value: any): boolean {
   return [String, Number, Boolean, Symbol, Object, Array].includes(value);
}

/**
 * Function which checks is the provided valuea an object
 *
 * @param { any } value value to be tested
 */
export function isObject (value: any): boolean {
   return !!(value && !Array.isArray(value) && typeof value === 'object');
}

/**
 * Returns the type of the provided data including array and null
 *
 * @param { any } value value to be tested
 * @returns { string }
 */
export function getType (value: any): string {
   if (typeof value === 'object') {
      if (Array.isArray(value)) return 'array';
      else if (!value) return 'null';
   }
   return typeof value;
}
