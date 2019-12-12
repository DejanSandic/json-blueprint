import { isTypeConstructor, isObject, getType } from '../src/helpers';

test('isTypeConstructor should return true', () => {
   expect(isTypeConstructor(String)).toBe(true);
   expect(isTypeConstructor(Number)).toBe(true);
   expect(isTypeConstructor(Symbol)).toBe(true);
   expect(isTypeConstructor(Array)).toBe(true);
   expect(isTypeConstructor(Object)).toBe(true);
});

test('isTypeConstructor should return false', () => {
   function Test () {}

   expect(isTypeConstructor(Function)).toBe(false);
   expect(isTypeConstructor(1)).toBe(false);
   expect(isTypeConstructor('1')).toBe(false);
   expect(isTypeConstructor({})).toBe(false);
   expect(isTypeConstructor([])).toBe(false);
   expect(isTypeConstructor(true)).toBe(false);
   expect(isTypeConstructor(null)).toBe(false);
   expect(isTypeConstructor(undefined)).toBe(false);
   expect(isTypeConstructor(Symbol.iterator)).toBe(false);
   expect(isTypeConstructor(Test)).toBe(false);
});

test('isObject should return true', () => {
   expect(isObject({})).toBe(true);
});

test('isObject should return false', () => {
   function Test () {}

   expect(isObject(Function)).toBe(false);
   expect(isObject(1)).toBe(false);
   expect(isObject('1')).toBe(false);
   expect(isObject([])).toBe(false);
   expect(isObject(true)).toBe(false);
   expect(isObject(null)).toBe(false);
   expect(isObject(undefined)).toBe(false);
   expect(isObject(Symbol.iterator)).toBe(false);
   expect(isObject(Test)).toBe(false);
});

test('getType should return type of the provided value', () => {
   expect(getType('1')).toBe('string');
   expect(getType(1)).toBe('number');
   expect(getType(undefined)).toBe('undefined');
   expect(getType(null)).toBe('null');
   expect(getType(Symbol.iterator)).toBe('symbol');
   expect(getType([])).toBe('array');
   expect(getType({})).toBe('object');
   expect(getType(function () {})).toBe('function');
   expect(getType(() => {})).toBe('function');
   expect(getType(Number)).toBe('function');
});
