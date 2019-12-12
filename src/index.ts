import validateMap from './validators/validateMap';
import { isObject, getType } from './helpers';

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
      if (!isObject(blueprint)) {
         throw new Error(`Type of blueprint is expected to be an object, ${getType(blueprint)} found instead.`);
      }

      this._name = name;
      this._blueprint = blueprint;
   }

   static create (name: string, blueprint: KeyValue) {
      return new Blueprint(name, blueprint);
   }

   validate (data: KeyValue) {
      if (!isObject(data)) {
         throw new Error(
            `Type of data provided to the ${this._name}.validate() function ` +
               `is expected to be an object, ${getType(data)} found instead.`
         );
      }
      validateMap(this._name, this._blueprint, {}, data);
   }
}

export default Blueprint;
