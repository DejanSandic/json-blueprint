import validateSymbol from '../src/validators/validateSymbol';

test('validateSymbol should not throw an error if the provided value is a symbol ', () => {
   expect(validateSymbol('testProp', {}, Symbol.iterator)).toBe(true);
});

test('validateSymbol should throw an error if the provided value is not a symbol ', () => {
   const fnStr = () => validateSymbol('testProp', {}, '1');
   expect(fnStr).toThrowError('Type of testProp is expected to be a symbol, string found instead.');

   const fnNum = () => validateSymbol('testProp', {}, 1);
   expect(fnNum).toThrowError('Type of testProp is expected to be a symbol, number found instead.');

   const fnBool = () => validateSymbol('testProp', {}, true);
   expect(fnBool).toThrowError('Type of testProp is expected to be a symbol, boolean found instead.');

   const fnUndf = () => validateSymbol('testProp', {}, undefined);
   expect(fnUndf).toThrowError('Property testProp is defined on the schema but it is missing on the provided data.');

   const fnNull = () => validateSymbol('testProp', {}, null);
   expect(fnNull).toThrowError('Type of testProp is expected to be a symbol, null found instead.');

   const fnArr = () => validateSymbol('testProp', {}, []);
   expect(fnArr).toThrowError('Type of testProp is expected to be a symbol, array found instead.');

   const fnObj = () => validateSymbol('testProp', {}, {});
   expect(fnObj).toThrowError('Type of testProp is expected to be a symbol, object found instead.');

   const fnFn = () => validateSymbol('testProp', {}, () => {});
   expect(fnFn).toThrowError('Type of testProp is expected to be a symbol, function found instead.');
});

test('validateSymbol should not throw an error if the provided string is missing and is not required.', () => {
   expect(validateSymbol('testProp', { required: false }, undefined)).toBe(true);
});

test('validateSymbol should invoke validate function (if provided) with the property name and the provided value.', () => {
   const validateTest = jest.fn();

   validateSymbol('testProp', { validate: validateTest }, Symbol.iterator);
   expect(validateTest).toBeCalledWith('testProp', Symbol.iterator);

   validateSymbol('testProp2', { validate: validateTest }, Symbol.iterator);
   expect(validateTest).toBeCalledWith('testProp2', Symbol.iterator);
});

test('validateSymbol should throw an error if provided validate property is not a function.', () => {
   const val1: any = 'string';
   const fnStr = () => validateSymbol('testProp', { validate: val1 }, Symbol.iterator);
   expect(fnStr).toThrowError('Validator for the property testProp should be a function, string found instead.');

   const val2: any = 1;
   const fnNum = () => validateSymbol('testProp', { validate: val2 }, Symbol.iterator);
   expect(fnNum).toThrowError('Validator for the property testProp should be a function, number found instead.');

   const val3: any = true;
   const fnBool = () => validateSymbol('testProp', { validate: val3 }, Symbol.iterator);
   expect(fnBool).toThrowError('Validator for the property testProp should be a function, boolean found instead.');

   const val4: any = Symbol.iterator;
   const fnSym = () => validateSymbol('testProp', { validate: val4 }, Symbol.iterator);
   expect(fnSym).toThrowError('Validator for the property testProp should be a function, symbol found instead.');

   const val5: any = [];
   const fnArr = () => validateSymbol('testProp', { validate: val5 }, Symbol.iterator);
   expect(fnArr).toThrowError('Validator for the property testProp should be a function, array found instead.');

   const val6: any = {};
   const fnObj = () => validateSymbol('testProp', { validate: val6 }, Symbol.iterator);
   expect(fnObj).toThrowError('Validator for the property testProp should be a function, object found instead.');
});
