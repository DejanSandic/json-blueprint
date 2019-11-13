import validateString from '../src/validators/validateString';

test('validateString should not throw an error if the provided value is a string ', () => {
	expect(validateString('testProp', {}, 'string')).toBe(true);
});

test('validateString should throw an error if the provided value is not a string ', () => {
	const fnNum = () => validateString('testProp', {}, 1);
	expect(fnNum).toThrowError('Type of testProp is expected to be a string, number found instead.');

	const fnBool = () => validateString('testProp', {}, true);
	expect(fnBool).toThrowError('Type of testProp is expected to be a string, boolean found instead.');

	const fnSym = () => validateString('testProp', {}, Symbol.iterator);
	expect(fnSym).toThrowError('Type of testProp is expected to be a string, symbol found instead.');

	const fnUndf = () => validateString('testProp', {}, undefined);
	expect(fnUndf).toThrowError('Property testProp is defined on the blueprint but it is missing on the provided data.');

	const fnNull = () => validateString('testProp', {}, null);
	expect(fnNull).toThrowError('Type of testProp is expected to be a string, null found instead.');

	const fnArr = () => validateString('testProp', {}, []);
	expect(fnArr).toThrowError('Type of testProp is expected to be a string, array found instead.');

	const fnObj = () => validateString('testProp', {}, {});
	expect(fnObj).toThrowError('Type of testProp is expected to be a string, object found instead.');

	const fnFn = () => validateString('testProp', {}, () => {});
	expect(fnFn).toThrowError('Type of testProp is expected to be a string, function found instead.');
});

test('validateString should not throw an error if the provided value does match specified max and min length.', () => {
	expect(validateString('testProp', { minLength: 1, maxLength: 6 }, 'string')).toBe(true);

	expect(validateString('testProp', { minLength: 6 }, 'string')).toBe(true);

	expect(validateString('testProp', { maxLength: 7 }, 'string2')).toBe(true);
});

test('validateString should throw an error if the provided value does not match specified min and max length.', () => {
	const fnShort = () => validateString('testProp', { minLength: 7 }, 'string');
	expect(fnShort).toThrowError('String testProp needs to be at least 7 characters long, 6 characters found.');

	const fnLong = () => validateString('testProp', { maxLength: 5 }, 'string');
	expect(fnLong).toThrowError('String testProp can contain maximum of 5 characters, 6 characters found.');
});

test('validateString should not throw an error if the provided string does not match specified regex pattern.', () => {
	expect(validateString('testProp', { match: /string/g }, 'string')).toBe(true);

	const fnMatch = () => expect(validateString('testProp', { match: /12/g }, 'string')).toBe(true);
	expect(fnMatch).toThrowError('String testProp does not match required regex format /12/g, string string found.');
});

test('validateString should not throw an error if the provided string is missing and is not required.', () => {
	expect(validateString('testProp', { required: false }, undefined)).toBe(true);
});

test('validateString should invoke validate function (if provided) with the property name and the provided value.', () => {
	const validateTest = jest.fn();

	validateString('testProp', { validate: validateTest }, 'foo');
	expect(validateTest).toBeCalledWith('testProp', 'foo');

	validateString('testProp2', { validate: validateTest }, 'bar');
	expect(validateTest).toBeCalledWith('testProp2', 'bar');
});

test('validateString should throw an error if provided validate property is not a function.', () => {
	const val1: any = 'string';
	const fnStr = () => validateString('testProp', { validate: val1 }, 'foo');
	expect(fnStr).toThrowError('Validator for the property testProp should be a function, string found instead.');

	const val2: any = 1;
	const fnNum = () => validateString('testProp', { validate: val2 }, 'foo');
	expect(fnNum).toThrowError('Validator for the property testProp should be a function, number found instead.');

	const val3: any = true;
	const fnBool = () => validateString('testProp', { validate: val3 }, 'foo');
	expect(fnBool).toThrowError('Validator for the property testProp should be a function, boolean found instead.');

	const val4: any = Symbol.iterator;
	const fnSym = () => validateString('testProp', { validate: val4 }, 'foo');
	expect(fnSym).toThrowError('Validator for the property testProp should be a function, symbol found instead.');

	const val5: any = [];
	const fnArr = () => validateString('testProp', { validate: val5 }, 'foo');
	expect(fnArr).toThrowError('Validator for the property testProp should be a function, array found instead.');

	const val6: any = {};
	const fnObj = () => validateString('testProp', { validate: val6 }, 'foo');
	expect(fnObj).toThrowError('Validator for the property testProp should be a function, object found instead.');
});
