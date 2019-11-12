import validateObject from './validators/validateObject';
import validateMap from './validators/validateMap';

interface KeyValue {
   [key: string]: any;
}

class Blueprint {
   _blueprint: KeyValue;

   constructor (blueprint: KeyValue) {
      if (typeof blueprint === 'undefined') {
         throw new Error('Type of blueprint is expected to be an object, undefined found instead.');
      }

      validateObject('blueprint', {}, blueprint);
      this._blueprint = blueprint;
   }

   static create (blueprint: KeyValue) {
      return new Blueprint(blueprint);
   }

   validate (data: KeyValue) {
      if (typeof data === 'undefined') {
         throw new Error(
            'Type of data provided to the Blueprint.validate() function ' +
               'is expected to be an object, undefined found instead.'
         );
      }
      validateObject('data provided to the Blueprint.validate() function', {}, data);
      validateMap(null, this._blueprint, {}, data);
   }
}

export default Blueprint;
