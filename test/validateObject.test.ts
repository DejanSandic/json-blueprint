import validateObject from '../src/validators/validateObject';

test('validateObject should not throw an error if the provided value is an object', () => {
   expect(validateObject('testProp', {}, {})).toBe(true);
});

test('validateObject should throw an error if the provided value is not an object.', () => {
   const fnStr = () => validateObject('testProp', {}, '1');
   expect(fnStr).toThrowError('Type of testProp is expected to be an object, string found instead.');

   const fnNum = () => validateObject('testProp', {}, 1);
   expect(fnNum).toThrowError('Type of testProp is expected to be an object, number found instead.');

   const fnBool = () => validateObject('testProp', {}, true);
   expect(fnBool).toThrowError('Type of testProp is expected to be an object, boolean found instead.');

   const fnUndf = () => validateObject('testProp', {}, undefined);
   expect(fnUndf).toThrowError('Property testProp is defined on the blueprint but it is missing on the provided data.');

   const fnNull = () => validateObject('testProp', {}, null);
   expect(fnNull).toThrowError('Type of testProp is expected to be an object, null found instead.');

   const fnArr = () => validateObject('testProp', {}, []);
   expect(fnArr).toThrowError('Type of testProp is expected to be an object, array found instead.');

   const fnSym = () => validateObject('testProp', {}, Symbol.iterator);
   expect(fnSym).toThrowError('Type of testProp is expected to be an object, symbol found instead.');

   const fnFn = () => validateObject('testProp', {}, () => {});
   expect(fnFn).toThrowError('Type of testProp is expected to be an object, function found instead.');
});

test('validateObject should not throw an error if the provided string is missing and is not required.', () => {
   expect(validateObject('testProp', { required: false }, undefined)).toBe(true);
});

test('validateObject should invoke validate function (if provided) with the property name and the provided value.', () => {
   const validateTest = jest.fn();

   validateObject('testProp', { validate: validateTest }, {});
   expect(validateTest).toBeCalledWith('testProp', {});

   validateObject('testProp2', { validate: validateTest }, {});
   expect(validateTest).toBeCalledWith('testProp2', {});
});

test('validateObject should throw an error if provided validate property is not a function.', () => {
   const val1: any = 'string';
   const fnStr = () => validateObject('testProp', { validate: val1 }, {});
   expect(fnStr).toThrowError('Validator for the property testProp should be a function, string found instead.');

   const val2: any = 1;
   const fnNum = () => validateObject('testProp', { validate: val2 }, {});
   expect(fnNum).toThrowError('Validator for the property testProp should be a function, number found instead.');

   const val3: any = true;
   const fnBool = () => validateObject('testProp', { validate: val3 }, {});
   expect(fnBool).toThrowError('Validator for the property testProp should be a function, boolean found instead.');

   const val4: any = Symbol.iterator;
   const fnSym = () => validateObject('testProp', { validate: val4 }, {});
   expect(fnSym).toThrowError('Validator for the property testProp should be a function, symbol found instead.');

   const val5: any = [];
   const fnArr = () => validateObject('testProp', { validate: val5 }, {});
   expect(fnArr).toThrowError('Validator for the property testProp should be a function, array found instead.');

   const val6: any = {};
   const fnObj = () => validateObject('testProp', { validate: val6 }, {});
   expect(fnObj).toThrowError('Validator for the property testProp should be a function, object found instead.');
});
