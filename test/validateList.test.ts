import validateList from '../src/validators/validateList';
import * as validateListExport from '../src/validators/validateList';

// Import inner functions used by the validateList()
import validateValue from '../src/validators/validateValue';
import validateObject from '../src/validators/validateObject';
import validateArray from '../src/validators/validateArray';
import validateMap from '../src/validators/validateMap';

// Mock inner functions used by the validateList()
jest.mock('../src/validators/validateValue');
jest.mock('../src/validators/validateObject');
jest.mock('../src/validators/validateArray');
jest.mock('../src/validators/validateMap');

test('validateList should throw an error if the blueprint for the property is not of a valid type.', () => {
   const fn1 = () => validateList('testProp', undefined, {}, [1]);
   expect(fn1).toThrowError(
      "Unsuported blueprint type for the property 'testProp' (undefined). Check the documentation for the supported blueprint types."
   );
   const fn2 = () => validateList('testProp', null, {}, [1]);
   expect(fn2).toThrowError(
      "Unsuported blueprint type for the property 'testProp' (null). Check the documentation for the supported blueprint types."
   );
   const fn3 = () => validateList('testProp', 1, {}, [1]);
   expect(fn3).toThrowError(
      "Unsuported blueprint type for the property 'testProp' (number). Check the documentation for the supported blueprint types."
   );
   const fn4 = () => validateList('testProp', 'Hello', {}, [1]);
   expect(fn4).toThrowError(
      "Unsuported blueprint type for the property 'testProp' (string). Check the documentation for the supported blueprint types."
   );
   const fn5 = () => validateList('testProp', Symbol.iterator, {}, [1]);
   expect(fn5).toThrowError(
      "Unsuported blueprint type for the property 'testProp' (symbol). Check the documentation for the supported blueprint types."
   );
   const fn6 = () => validateList('testProp', { type: 1 }, {}, [1]);
   expect(fn6).toThrowError(
      "Unsuported blueprint type for the property 'testProp[0]' (number). Check the documentation for the supported blueprint types."
   );
});

test('validateList should throw an error if the options object is not provided.', () => {
   const fnUndf = () => validateList('testProp', {}, undefined, undefined);
   expect(fnUndf).toThrowError(
      'Options object is expected to be passed to the validateList function, undefined found instead.'
   );
});

test('validateList should throw an error if the property defined on the blueprint is not provided.', () => {
   const fnUndf = () => validateList('testProp', String, {}, undefined);
   expect(fnUndf).toThrowError('Property testProp is defined on the blueprint but it is missing on the provided data.');
});

test('validateList should not throw an error if the property defined on the blueprint is not provided, but it is not required.', () => {
   const fnUndf = () => validateList('testProp', String, { required: false }, undefined);
   expect(fnUndf).not.toThrow();
});

test('validateList should throw an error if the provided value is not an Array.', () => {
   const fn1 = () => validateList('testProp', Number, {}, 1);
   expect(fn1).toThrowError('Data passed for the property testProp is suposed to be an Array, number found instead.');
   const fn2 = () => validateList('testProp', Number, {}, 'Helo');
   expect(fn2).toThrowError('Data passed for the property testProp is suposed to be an Array, string found instead.');
   const fn3 = () => validateList('testProp', Number, {}, {});
   expect(fn3).toThrowError('Data passed for the property testProp is suposed to be an Array, object found instead.');
   const fn4 = () => validateList('testProp', Number, {}, Symbol.iterator);
   expect(fn4).toThrowError('Data passed for the property testProp is suposed to be an Array, symbol found instead.');
   const fn5 = () => validateList('testProp', Number, {}, true);
   expect(fn5).toThrowError('Data passed for the property testProp is suposed to be an Array, boolean found instead.');
   const fn6 = () => validateList('testProp', Number, {}, null);
   expect(fn6).toThrowError('Data passed for the property testProp is suposed to be an Array, null found instead.');
});

test('validateList should not throw an error if the provided value does match specified max and min length.', () => {
   const fn1 = () => validateList('testProp', Number, { minLength: 1, maxLength: 3 }, [1, 2]);
   const fn2 = () => validateList('testProp', Number, { minLength: 2 }, [1, 2]);
   const fn3 = () => validateList('testProp', Number, { maxLength: 3 }, [1, 2, 3]);

   expect(fn1).not.toThrow();
   expect(fn2).not.toThrow();
   expect(fn3).not.toThrow();
});

test('validateList should throw an error if the provided value does not match specified min and max length.', () => {
   const fnShort = () => validateList('testProp', Number, { minLength: 2 }, [1]);
   expect(fnShort).toThrowError('Array testProp needs to have at least 2 items, 1 items found.');

   const fnLong = () => validateList('testProp', Number, { maxLength: 2 }, [1, 2, 3]);
   expect(fnLong).toThrowError('Array testProp can contain maximum of 2 items, 3 items found.');
});

test('validateList should invoke validate function (if provided) with the property name and the provided value.', () => {
   const validateTest = jest.fn();

   validateList('testProp', Number, { validate: validateTest }, [1]);
   expect(validateTest).toBeCalledWith('testProp', [1]);

   validateList('testProp2', Number, { validate: validateTest }, [2]);
   expect(validateTest).toBeCalledWith('testProp2', [2]);
});

test('validateList should throw an error if provided validate property is not a function.', () => {
   const val1: any = 'string';
   const fnStr = () => validateList('testProp', Number, { validate: val1 }, [1]);
   expect(fnStr).toThrowError('Validator for the property testProp should be a function, string found instead.');

   const val2: any = 1;
   const fnNum = () => validateList('testProp', Number, { validate: val2 }, [1]);
   expect(fnNum).toThrowError('Validator for the property testProp should be a function, number found instead.');

   const val3: any = true;
   const fnBool = () => validateList('testProp', Number, { validate: val3 }, [1]);
   expect(fnBool).toThrowError('Validator for the property testProp should be a function, boolean found instead.');

   const val4: any = Symbol.iterator;
   const fnSym = () => validateList('testProp', Number, { validate: val4 }, [1]);
   expect(fnSym).toThrowError('Validator for the property testProp should be a function, symbol found instead.');

   const val5: any = [];
   const fnArr = () => validateList('testProp', Number, { validate: val5 }, [1]);
   expect(fnArr).toThrowError('Validator for the property testProp should be a function, array found instead.');

   const val6: any = {};
   const fnObj = () => validateList('testProp', Number, { validate: val6 }, [1]);
   expect(fnObj).toThrowError('Validator for the property testProp should be a function, object found instead.');
});

test(
   'validateList should invoke validateValue if validator is the type constructor\n' +
      'or validator has the type property wich is the type constructor.',
   () => {
      // @ts-ignore
      validateValue.mockReset();
      validateList('testProp', Number, {}, [1]);
      validateList('testProp', String, {}, ['1']);
      validateList('testProp', Boolean, {}, [true]);
      validateList('testProp', Array, {}, [[1, 2]]);
      validateList('testProp', Object, {}, [{ c: 1 }]);
      validateList('testProp', Symbol, {}, [Symbol.iterator]);

      validateList('testProp', { type: Number }, {}, [1]);
      validateList('testProp', { type: String }, {}, ['1']);
      validateList('testProp', { type: Boolean }, {}, [true]);
      validateList('testProp', { type: Array }, {}, [[1, 2]]);
      validateList('testProp', { type: Object }, {}, [{ c: 1 }]);
      validateList('testProp', { type: Symbol }, {}, [Symbol.iterator]);

      expect(validateValue).toBeCalledTimes(12);
      expect(validateObject).not.toBeCalled();
      expect(validateMap).not.toBeCalled();

      // @ts-ignore
      validateValue.mockReset();
      // @ts-ignore
      validateArray.mockReset();
   }
);

test('If provided validator is a function or an object with the type property whch is an object, validateList should invoke it.', () => {
   const validator = jest.fn();

   validateList('testProp', validator, {}, [1]);
   validateList('testProp', { type: validator }, {}, [1]);

   expect(validator).toBeCalledTimes(2);
});

test('validateList should invoke validateArray and itself recursively if validator is an array.', () => {
   const mock = jest.spyOn(validateListExport, 'default');
   validateList('testProp', [String], {}, [['Hello']]);
   expect(mock).toBeCalledTimes(2);
});

test('validateList should invoke validateObject and validateMap validator is an object.', () => {
   validateList('testProp', { a: String }, {}, [{ a: 'Hello' }]);
   expect(validateMap).toBeCalled();
});
