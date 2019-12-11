import validateObject from './validators/validateObject';
import validateMap from './validators/validateMap';

interface KeyValue {
   [key: string]: any;
}

class Blueprint {
   _blueprint: KeyValue;
   _name: string;

   constructor (name: string, blueprint: KeyValue) {
      if (typeof name !== 'string') {
         throw new Error('Name of the blueprint is expected to be a string.');
      }
      if (typeof blueprint === 'undefined') {
         throw new Error('Type of blueprint is expected to be an object, undefined found instead.');
      }

      validateObject('blueprint', {}, blueprint);
      this._name = name;
      this._blueprint = blueprint;
   }

   static create (name: string, blueprint: KeyValue) {
      return new Blueprint(name, blueprint);
   }

   validate (data: KeyValue) {
      if (typeof data === 'undefined') {
         throw new Error(
            `Type of data provided to the ${this._name}.validate() function ` +
               'is expected to be an object, undefined found instead.'
         );
      }
      validateObject('data provided to the Blueprint.validate() function', {}, data);
      validateMap(this._name, this._blueprint, {}, data);
   }
}

export default Blueprint;
