import validateMap from '../validators/validateMap';
export function Any (...any: any) {}

Any.of = function (...validators: any[]) {
   return function (prop: string, value: any, options?: any) {
      let matched = validators.filter(validator => {
         try {
            validateMap('Any.of', { value: validator }, {}, { value });
            return true;
         } catch (err) {
            return false;
         }
      });

      if (!matched.length) {
         throw new Error(`Property ${prop} does not match any of the expected validators.`);
      }
   };
};
