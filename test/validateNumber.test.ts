import validateNumber from '../src/validators/validateNumber';

test('validateNumber should not throw an error if the provided value is a number ', () => {
   expect(validateNumber('testProp', {}, 1)).toBe(true);
});

test('validateNumber should throw an error if the provided value is not a number ', () => {
   const fnStr = () => validateNumber('testProp', {}, '1');
   expect(fnStr).toThrowError('Type of testProp is expected to be a number, string found instead.');

   const fnBool = () => validateNumber('testProp', {}, true);
   expect(fnBool).toThrowError('Type of testProp is expected to be a number, boolean found instead.');

   const fnSym = () => validateNumber('testProp', {}, Symbol.iterator);
   expect(fnSym).toThrowError('Type of testProp is expected to be a number, symbol found instead.');

   const fnUndf = () => validateNumber('testProp', {}, undefined);
   expect(fnUndf).toThrowError('Property testProp is defined on the blueprint but it is missing on the provided data.');

   const fnNull = () => validateNumber('testProp', {}, null);
   expect(fnNull).toThrowError('Type of testProp is expected to be a number, null found instead.');

   const fnArr = () => validateNumber('testProp', {}, []);
   expect(fnArr).toThrowError('Type of testProp is expected to be a number, array found instead.');

   const fnObj = () => validateNumber('testProp', {}, {});
   expect(fnObj).toThrowError('Type of testProp is expected to be a number, object found instead.');

   const fnFn = () => validateNumber('testProp', {}, () => {});
   expect(fnFn).toThrowError('Type of testProp is expected to be a number, function found instead.');
});

test('validateNumber should not throw an error if the provided value is between specified min and max values.', () => {
   expect(validateNumber('testProp', { min: 1, max: 6 }, 5)).toBe(true);

   expect(validateNumber('testProp', { min: 7 }, 7)).toBe(true);

   expect(validateNumber('testProp', { max: 8 }, 8)).toBe(true);
});

test('validateNumber should throw an error if the provided value is not between specified min and max values.', () => {
   expect(validateNumber('testProp', { min: 1, max: 6 }, 5)).toBe(true);

   const fnShort = () => validateNumber('testProp', { min: 7 }, 6);
   expect(fnShort).toThrowError('Number testProp can have maximum value of 7, 6 found.');

   const fnLong = () => validateNumber('testProp', { max: 8 }, 9);
   expect(fnLong).toThrowError('Number testProp can have maximum value of 8, 9 found.');
});

test('validateNumber should not throw an error if the provided value is missing and is not required.', () => {
   expect(validateNumber('testProp', { required: false }, undefined)).toBe(true);
});

test('validateNumber should invoke validate function (if provided) with the property name and the provided value.', () => {
   const validateTest = jest.fn();

   validateNumber('testProp', { validate: validateTest }, 2);
   expect(validateTest).toBeCalledWith('testProp', 2);

   validateNumber('testProp2', { validate: validateTest }, 88);
   expect(validateTest).toBeCalledWith('testProp2', 88);
});

test('validateNumber should throw an error if provided validate property is not a function.', () => {
   const val1: any = 'string';
   const fnStr = () => validateNumber('testProp', { validate: val1 }, 1);
   expect(fnStr).toThrowError('Validator for the property testProp should be a function, string found instead.');

   const val2: any = 1;
   const fnNum = () => validateNumber('testProp', { validate: val2 }, 1);
   expect(fnNum).toThrowError('Validator for the property testProp should be a function, number found instead.');

   const val3: any = true;
   const fnBool = () => validateNumber('testProp', { validate: val3 }, 1);
   expect(fnBool).toThrowError('Validator for the property testProp should be a function, boolean found instead.');

   const val4: any = Symbol.iterator;
   const fnSym = () => validateNumber('testProp', { validate: val4 }, 1);
   expect(fnSym).toThrowError('Validator for the property testProp should be a function, symbol found instead.');

   const val5: any = [];
   const fnArr = () => validateNumber('testProp', { validate: val5 }, 1);
   expect(fnArr).toThrowError('Validator for the property testProp should be a function, array found instead.');

   const val6: any = {};
   const fnObj = () => validateNumber('testProp', { validate: val6 }, 1);
   expect(fnObj).toThrowError('Validator for the property testProp should be a function, object found instead.');
});
