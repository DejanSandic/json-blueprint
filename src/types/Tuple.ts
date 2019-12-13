import validateMap from '../validators/validateMap';
import { getType } from '../helpers';

export function Tuple (...validators: any[]) {
   return function (prop: string, value: any, options?: any) {
      if (!Array.isArray(value)) {
         throw new Error(`Property ${prop} is expected to be an array, ${getType(value)} found instead.`);
      }
      if (validators.length !== value.length) {
         throw new Error(`Array ${prop} is expected to have ${validators.length} items, ${value.length} items found.`);
      }

      validators.forEach((validator, index) => {
         const item = value[index];
         try {
            validateMap(prop, { [index]: validator }, {}, { [index]: item });
         } catch (err) {
            // Replace Array.n with Array[n]
            let error = err.message.replace(/\.(\d)/g, (_: any, n: string) => `[${n}]`);

            throw new Error(error);
         }
      });
   };
}
