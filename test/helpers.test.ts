import { isTypeConstructor, combinePropNames, getType } from '../src/validators/helpers';

test('isTypeConstructor should return true', () => {
   expect(isTypeConstructor(String)).toBe(true);
   expect(isTypeConstructor(Number)).toBe(true);
   expect(isTypeConstructor(Symbol)).toBe(true);
   expect(isTypeConstructor(Array)).toBe(true);
   expect(isTypeConstructor(Object)).toBe(true);
});

test('isTypeConstructor should return true', () => {
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

test('combinePropNames should return chained prop names', () => {
   expect(combinePropNames('', 'prop')).toBe('prop');
   expect(combinePropNames('parent', 'prop')).toBe('parent.prop');
   expect(combinePropNames('parent.child', 'prop')).toBe('parent.child.prop');
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
