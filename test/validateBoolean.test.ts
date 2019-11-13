import validateBoolean from '../src/validators/validateBoolean';

test('validateBoolean should not throw an error if the provided value is a boolean ', () => {
   expect(validateBoolean('testProp', {}, true)).toBe(true);
   expect(validateBoolean('testProp', {}, false)).toBe(true);
});

test('validateBoolean should throw an error if the provided value is not a boolean ', () => {
   const fnStr = () => validateBoolean('testProp', {}, '1');
   expect(fnStr).toThrowError('Type of testProp is expected to be a boolean, string found instead.');

   const fnNum = () => validateBoolean('testProp', {}, 1);
   expect(fnNum).toThrowError('Type of testProp is expected to be a boolean, number found instead.');

   const fnSym = () => validateBoolean('testProp', {}, Symbol.iterator);
   expect(fnSym).toThrowError('Type of testProp is expected to be a boolean, symbol found instead.');

   const fnUndf = () => validateBoolean('testProp', {}, undefined);
   expect(fnUndf).toThrowError('Property testProp is defined on the blueprint but it is missing on the provided data.');

   const fnNull = () => validateBoolean('testProp', {}, null);
   expect(fnNull).toThrowError('Type of testProp is expected to be a boolean, null found instead.');

   const fnArr = () => validateBoolean('testProp', {}, []);
   expect(fnArr).toThrowError('Type of testProp is expected to be a boolean, array found instead.');

   const fnObj = () => validateBoolean('testProp', {}, {});
   expect(fnObj).toThrowError('Type of testProp is expected to be a boolean, object found instead.');

   const fnFn = () => validateBoolean('testProp', {}, () => {});
   expect(fnFn).toThrowError('Type of testProp is expected to be a boolean, function found instead.');
});

test('validateBoolean should not throw an error if the provided string is missing and is not required.', () => {
   expect(validateBoolean('testProp', { required: false }, undefined)).toBe(true);
});

test('validateBoolean should invoke validate function (if provided) with the property name and the provided value.', () => {
   const validateTest = jest.fn();

   validateBoolean('testProp', { validate: validateTest }, true);
   expect(validateTest).toBeCalledWith('testProp', true);

   validateBoolean('testProp2', { validate: validateTest }, false);
   expect(validateTest).toBeCalledWith('testProp2', false);
});

test('validateBoolean should throw an error if provided validate property is not a function.', () => {
   const val1: any = 'string';
   const fnStr = () => validateBoolean('testProp', { validate: val1 }, true);
   expect(fnStr).toThrowError('Validator for the property testProp should be a function, string found instead.');

   const val2: any = 1;
   const fnNum = () => validateBoolean('testProp', { validate: val2 }, true);
   expect(fnNum).toThrowError('Validator for the property testProp should be a function, number found instead.');

   const val3: any = true;
   const fnBool = () => validateBoolean('testProp', { validate: val3 }, true);
   expect(fnBool).toThrowError('Validator for the property testProp should be a function, boolean found instead.');

   const val4: any = Symbol.iterator;
   const fnSym = () => validateBoolean('testProp', { validate: val4 }, true);
   expect(fnSym).toThrowError('Validator for the property testProp should be a function, symbol found instead.');

   const val5: any = [];
   const fnArr = () => validateBoolean('testProp', { validate: val5 }, true);
   expect(fnArr).toThrowError('Validator for the property testProp should be a function, array found instead.');

   const val6: any = {};
   const fnObj = () => validateBoolean('testProp', { validate: val6 }, true);
   expect(fnObj).toThrowError('Validator for the property testProp should be a function, object found instead.');
});
