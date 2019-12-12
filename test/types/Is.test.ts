import { Is } from '../../src/types';

/**
 * Is
 */
describe('Is', () => {
   test('should be a function.', () => {
      expect(typeof Is).toBe('function');
   });

   // Test primitive values
   test('should throw error if the wrong value is provided.', () => {
      const validator = Is(2);
      expect(() => validator('myNumber', 1)).toThrowError(
         'Wrong value recieved for the property myNumber. Expected: 2, recieved: 1'
      );
   });

   test("shouldn't throw error if the correct value is provided.", () => {
      const validator = Is('Hello');
      expect(() => validator('myString', 'Hello')).not.toThrow();
   });

   // Test objects
   test("should throw error if the provided object doesn't match expected object.", () => {
      const validator = Is({ a: 1 });
      expect(() => validator('myObj', { c: 3 })).toThrowError(
         'Wrong value recieved for the property myObj. Expected: {"a":1}, recieved: {"c":3}'
      );
   });

   test("shouldn't throw error if the provided object matches expected object.", () => {
      const validator = Is({ b: 2 });
      expect(() => validator('myObj', { b: 2 })).not.toThrow();
   });

   // Test arrays
   test("should throw error if the provided array doesn't match expected array.", () => {
      const validator = Is([1]);
      expect(() => validator('myArr', [3])).toThrowError(
         'Wrong value recieved for the property myArr. Expected: [1], recieved: [3]'
      );
   });

   test("shouldn't throw error if the provided array matches expected array.", () => {
      const validator = Is.oneOf([2]);
      expect(() => validator('myArr', [2])).not.toThrow();
   });
});

/**
 * Is.oneOff
 */
describe('Is.oneOf', () => {
   test('should be a function.', () => {
      expect(typeof Is.oneOf).toBe('function');
   });

   // Test primitive values
   test("shouldn't throw error if the correct value is provided.", () => {
      const validator = Is.oneOf(2, 'foo', 4, 'bar');
      expect(() => validator('randomValue', 'bar')).not.toThrow();
   });

   test('should throw error if the wrong value is provided.', () => {
      const validator = Is.oneOf(2, 'foo', 4, 'bar');
      expect(() => validator('randomValue', 'baz')).toThrowError(
         'Wrong value recieved for the property randomValue. Expected: ( 2 | foo | 4 | bar ), recieved: baz'
      );
   });

   // Test objects
   test("should throw error if the provided object doesn't match expected object.", () => {
      const validator = Is.oneOf({ a: 1 }, { b: 2 });
      expect(() => validator('myObj', { c: 3 })).toThrowError(
         'Wrong value recieved for the property myObj. Expected: ( {"a":1} | {"b":2} ), recieved: {"c":3}'
      );
   });

   test("shouldn't throw error if the provided object matches expected object.", () => {
      const validator = Is.oneOf({ a: 1 }, { b: 2 });
      expect(() => validator('myObj', { b: 2 })).not.toThrow();
   });

   // Test arrays
   test("should throw error if the provided array doesn't match expected array.", () => {
      const validator = Is.oneOf([1], [2]);
      expect(() => validator('myArr', [3])).toThrowError(
         'Wrong value recieved for the property myArr. Expected: ( [1] | [2] ), recieved: [3]'
      );
   });

   test("shouldn't throw error if the provided array matches expected array.", () => {
      const validator = Is.oneOf([1], [2]);
      expect(() => validator('myArr', [2])).not.toThrow();
   });
});
