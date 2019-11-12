import validateString from './validateString';
import validateNumber from './validateNumber';
import validateBoolean from './validateBoolean';
import validateSymbol from './validateSymbol';
import validateObject from './validateObject';
import validateArray from './validateArray';
import validateMap from './validateMap';
import validateList from './validateList';

interface Options {
   [key: string]: any;
}

/**
 * Function which invokes other validators based on the
 * provided constructor
 *
 * @param { string } prop
 * @param { function } constructor
 * @param { object } options
 * @param { any } value
 */
export default function validateValue (prop: string, constructor: Function, options: Options, value: any) {
   const { items, ...rest } = options;

   switch (constructor) {
   case String:
      return validateString(prop, options, value);
   case Number:
      return validateNumber(prop, options, value);
   case Boolean:
      return validateBoolean(prop, options, value);
   case Symbol:
      return validateSymbol(prop, options, value);
   case Object:
      if (items) return validateMap(prop, items, rest, value);
      return validateObject(prop, options, value);
   case Array:
      if (items) return validateList(prop, items, rest, value);
      return validateArray(prop, options, value);
   }
}
