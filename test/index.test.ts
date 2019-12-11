import Blueprint from '../src';

// Import inner functions used by the Blueprint
import * as validateMapExport from '../src/validators/validateMap';

const nameAndAgeBlueprint = {
   name: String,
   age: Number
};

const nameAndAge = {
   name: 'Blue Moon',
   age: 1
};

test('Calling new Blueprint and Blueprint.create should create a new Blueprint instance.', () => {
   const blueprint = new Blueprint('Blueprint1', nameAndAgeBlueprint);
   expect(blueprint._name).toBe('Blueprint1');
   expect(blueprint._blueprint).toBe(nameAndAgeBlueprint);

   const blueprint2 = Blueprint.create('Blueprint2', nameAndAgeBlueprint);
   expect(blueprint2._name).toBe('Blueprint2');
   expect(blueprint2._blueprint).toBe(nameAndAgeBlueprint);
});

test('Calling new Blueprint should throw an error if provided blueprint name is not a string..', () => {
   const val: any = 1;
   const fn = () => new Blueprint(val, val);
   expect(fn).toThrowError('Name of the blueprint is expected to be a string.');
});

test('Calling new Blueprint should throw an error if the provided schema is not an object.', () => {
   const val1: any = undefined;
   const fn1 = () => new Blueprint('Blueprint', val1);
   expect(fn1).toThrowError('Type of blueprint is expected to be an object, undefined found instead.');

   const val2: any = 1;
   const fn2 = () => new Blueprint('Blueprint', val2);
   expect(fn2).toThrowError('Type of blueprint is expected to be an object, number found instead.');

   const val3: any = 'string';
   const fn3 = () => new Blueprint('Blueprint', val3);
   expect(fn3).toThrowError('Type of blueprint is expected to be an object, string found instead.');

   const val4: any = [];
   const fn4 = () => new Blueprint('Blueprint', val4);
   expect(fn4).toThrowError('Type of blueprint is expected to be an object, array found instead.');

   const val5: any = function () {};
   const fn5 = () => new Blueprint('Blueprint', val5);
   expect(fn5).toThrowError('Type of blueprint is expected to be an object, function found instead.');
});

test('Calling validate() method should throw an error if the provided data is not an object.', () => {
   const blueprint = new Blueprint('Blueprint', nameAndAgeBlueprint);

   const val1: any = undefined;
   const fn1 = () => blueprint.validate(val1);
   expect(fn1).toThrowError(
      'Type of data provided to the Blueprint.validate() function ' +
         'is expected to be an object, undefined found instead.'
   );

   const val2: any = 1;
   const fn2 = () => blueprint.validate(val2);
   expect(fn2).toThrowError(
      'Type of data provided to the Blueprint.validate() function ' +
         'is expected to be an object, number found instead.'
   );

   const val3: any = 'string';
   const fn3 = () => blueprint.validate(val3);
   expect(fn3).toThrowError(
      'Type of data provided to the Blueprint.validate() function ' +
         'is expected to be an object, string found instead.'
   );

   const val4: any = [];
   const fn4 = () => blueprint.validate(val4);
   expect(fn4).toThrowError(
      'Type of data provided to the Blueprint.validate() function ' +
         'is expected to be an object, array found instead.'
   );

   const val5: any = function () {};
   const fn5 = () => blueprint.validate(val5);
   expect(fn5).toThrowError(
      'Type of data provided to the Blueprint.validate() function ' +
         'is expected to be an object, function found instead.'
   );
});

test('Calling validate() method should invoke validateMap function if provided data is an object.', () => {
   const validateMap = jest.spyOn(validateMapExport, 'default');

   const blueprint = new Blueprint('Blueprint', nameAndAgeBlueprint);
   blueprint.validate(nameAndAge);

   expect(validateMap).toBeCalledWith('Blueprint', blueprint._blueprint, {}, nameAndAge);
});
