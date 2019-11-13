import validateArray from '../src/validators/validateArray';

test('validateArray should not throw an error if the provided value is an array', () => {
   expect(validateArray('testProp', {}, [])).toBe(true);
});

test('validateArray should throw an error if the provided value is not an array.', () => {
   const fnStr = () => validateArray('testProp', {}, '1');
   expect(fnStr).toThrowError('Type of testProp is expected to be an array, string found instead.');

   const fnNum = () => validateArray('testProp', {}, 1);
   expect(fnNum).toThrowError('Type of testProp is expected to be an array, number found instead.');

   const fnBool = () => validateArray('testProp', {}, true);
   expect(fnBool).toThrowError('Type of testProp is expected to be an array, boolean found instead.');

   const fnUndf = () => validateArray('testProp', {}, undefined);
   expect(fnUndf).toThrowError('Property testProp is defined on the blueprint but it is missing on the provided data.');

   const fnNull = () => validateArray('testProp', {}, null);
   expect(fnNull).toThrowError('Type of testProp is expected to be an array, null found instead.');

   const fnObj = () => validateArray('testProp', {}, {});
   expect(fnObj).toThrowError('Type of testProp is expected to be an array, object found instead.');

   const fnSym = () => validateArray('testProp', {}, Symbol.iterator);
   expect(fnSym).toThrowError('Type of testProp is expected to be an array, symbol found instead.');

   const fnFn = () => validateArray('testProp', {}, () => {});
   expect(fnFn).toThrowError('Type of testProp is expected to be an array, function found instead.');
});

test('validateArray should not throw an error if the provided value does match specified max and min length.', () => {
   expect(validateArray('testProp', { minLength: 1, maxLength: 3 }, [1, 2])).toBe(true);

   expect(validateArray('testProp', { minLength: 2 }, [1, 2])).toBe(true);

   expect(validateArray('testProp', { maxLength: 3 }, [1, 2, 3])).toBe(true);
});

test('validateArray should throw an error if the provided value does not match specified min and max length.', () => {
   const fnShort = () => validateArray('testProp', { minLength: 2 }, [1]);
   expect(fnShort).toThrowError('Array testProp needs to have at least 2 items, 1 items found.');

   const fnLong = () => validateArray('testProp', { maxLength: 2 }, [1, 2, 3]);
   expect(fnLong).toThrowError('Array testProp can contain maximum of 2 items, 3 items found.');
});

test('validateArray should not throw an error if the provided string is missing and is not required.', () => {
   expect(validateArray('testProp', { required: false }, undefined)).toBe(true);
});

test('validateArray should invoke validate function (if provided) with the property name and the provided value.', () => {
   const validateTest = jest.fn();

   validateArray('testProp', { validate: validateTest }, []);
   expect(validateTest).toBeCalledWith('testProp', []);

   validateArray('testProp2', { validate: validateTest }, []);
   expect(validateTest).toBeCalledWith('testProp2', []);
});

test('validateArray should throw an error if provided validate property is not a function.', () => {
   const val1: any = 'string';
   const fnStr = () => validateArray('testProp', { validate: val1 }, []);
   expect(fnStr).toThrowError('Validator for the property testProp should be a function, string found instead.');

   const val2: any = 1;
   const fnNum = () => validateArray('testProp', { validate: val2 }, []);
   expect(fnNum).toThrowError('Validator for the property testProp should be a function, number found instead.');

   const val3: any = true;
   const fnBool = () => validateArray('testProp', { validate: val3 }, []);
   expect(fnBool).toThrowError('Validator for the property testProp should be a function, boolean found instead.');

   const val4: any = Symbol.iterator;
   const fnSym = () => validateArray('testProp', { validate: val4 }, []);
   expect(fnSym).toThrowError('Validator for the property testProp should be a function, symbol found instead.');

   const val5: any = [];
   const fnArr = () => validateArray('testProp', { validate: val5 }, []);
   expect(fnArr).toThrowError('Validator for the property testProp should be a function, array found instead.');

   const val6: any = {};
   const fnObj = () => validateArray('testProp', { validate: val6 }, []);
   expect(fnObj).toThrowError('Validator for the property testProp should be a function, object found instead.');
});
