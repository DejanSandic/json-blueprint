import { Tuple } from '../../src/types';

describe('Tuple', () => {
   test('should be a function.', () => {
      expect(typeof Tuple).toBe('function');
   });

   test('should throw error if the provided value is not an array.', () => {
      const validator = Tuple();
      const val: any = 1;
      expect(() => validator('testProp', val)).toThrowError(
         'Property testProp is expected to be an array, number found instead.'
      );
   });

   test('should throw error if the length of the provided array does not match the Touple legth.', () => {
      const validator = Tuple(String, String);
      expect(() => validator('testProp', ['Hello'])).toThrowError(
         'Array testProp is expected to have 2 items, 1 items found.'
      );

      const validator2 = Tuple(String);
      expect(() => validator2('testProp', ['Hello', 'World'])).toThrowError(
         'Array testProp is expected to have 1 items, 2 items found.'
      );
   });

   test('should throw error if the provided value does not match the type specified in the Tuple.', () => {
      const validator = Tuple(String, Number);
      expect(() => validator('testProp', ['Hello', 'world'])).toThrowError(
         'Type of testProp[1] is expected to be a number, string found instead.'
      );

      const validator2 = Tuple(String, Number, { name: String, age: Number });
      expect(() => validator2('testProp', ['Hello', 1, { name: 28, age: 28 }])).toThrowError(
         'Type of testProp[2].name is expected to be a string, number found instead.'
      );

      const validator3 = Tuple(Object, [String], String);
      expect(() => validator3('testProp', [{}, [1], 'Hello'])).toThrowError(
         'Type of testProp[1][0] is expected to be a string, number found instead.'
      );
   });

   test("shouldn't throw error if the provided value matches the type specified in the Tuple.", () => {
      const validator = Tuple(Object, [String], String, { name: String, age: Number });
      expect(() => validator('testProp', [{}, ['Hello'], 'World', { name: 'Deyo', age: 28 }])).not.toThrow();
   });
});
