import { Any } from '../src/types';

describe('Any', () => {
   test('should be a function', () => {
      expect(typeof Any).toBe('function');
   });

   test("shouldn't throw error no matter which value is provided", () => {
      expect(() => Any(1, 'Helo', {}, [], Symbol, new Error())).not.toThrow();
   });
});

describe('Any.of', () => {
   test('should be a function', () => {
      expect(typeof Any.of).toBe('function');
   });

   // Test JS type constructors
   test('should throw error if the wrong value is provided.', () => {
      const validator = Any.of(String, Number);
      expect(() => validator('randomValue', true)).toThrowError(
         'Property randomValue does not match any of the expected validators.'
      );
      expect(() => validator('randomValue', true)).toThrowError(
         'Property randomValue does not match any of the expected validators.'
      );
      expect(() => validator('randomValue', {})).toThrowError(
         'Property randomValue does not match any of the expected validators.'
      );
      expect(() => validator('randomValue', [])).toThrowError(
         'Property randomValue does not match any of the expected validators.'
      );

      // Test blueprint maps
      const validator2 = Any.of(Boolean, { a: String, b: Number }, { type: Array, minLength: 3 });
      expect(() => validator2('randomValue', { a: 1, b: 404 })).toThrowError(
         'Property randomValue does not match any of the expected validators.'
      );
      expect(() => validator2('randomValue', 'Hello')).toThrowError(
         'Property randomValue does not match any of the expected validators.'
      );
      expect(() => validator2('randomValue', [1, 2])).toThrowError(
         'Property randomValue does not match any of the expected validators.'
      );
   });

   test("shouldn't throw error if the correct value is provided.", () => {
      const validator = Any.of(String, Number, Object, Array);
      expect(() => validator('randomValue', 1)).not.toThrow();
      expect(() => validator('randomValue', {})).not.toThrow();
      expect(() => validator('randomValue', [])).not.toThrow();
      expect(() => validator('randomValue', 'Hello')).not.toThrow();

      // Test blueprint maps
      const validator2 = Any.of(Boolean, { a: String, b: Number }, { type: Array, minLength: 3 });
      expect(() => validator2('randomValue', { a: 'Hello', b: 404 })).not.toThrow();
      expect(() => validator2('randomValue', false)).not.toThrow();
      expect(() => validator2('randomValue', [1, 2, 3])).not.toThrow();
   });
});
