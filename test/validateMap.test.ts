import validateMap from '../src/validators/validateMap';
import * as validateMapExport from '../src/validators/validateMap';

// Import inner functions used by the validateMap()
import validateValue from '../src/validators/validateValue';
import validateObject from '../src/validators/validateObject';
import validateList from '../src/validators/validateList';

// Mock inner functions used by the validateMap()
jest.mock('../src/validators/validateValue');
jest.mock('../src/validators/validateObject');
jest.mock('../src/validators/validateList');

const options = {};

test('validateMap should throw an error if the property defined on the blueprint is not provided.', () => {
	const fnUndf = () => validateMap('testProp', {}, options, undefined);
	expect(fnUndf).toThrowError('Property testProp is defined on the blueprint but it is missing on the provided data.');
});

test(
	'validateMap should not throw an error if the property defined on the' +
		'blueprint is not provided, but it is not required.',
	() => {
		const fnUndf = () => validateMap('testProp', {}, { required: false }, undefined);
		expect(fnUndf).not.toThrow();
	}
);

test('validateMap should throw an error if the provided property is not defined on the blueprint.', () => {
	const validateFn = () => validateMap('testProp', {}, options, { a: 1 });
	expect(validateFn).toThrowError('Property testProp.a on the provided data is not defined on the blueprint.');
});

test(
	'validateMap should invoke validateValue if validator is the type constructor\n' +
		'or validator has the type property wich is the type constructor.',
	() => {
		validateMap('testProp', { a: Number }, options, { a: 1 });
		validateMap('testProp', { a: String }, options, { a: '1' });
		validateMap('testProp', { a: Boolean }, options, { a: true });
		validateMap('testProp', { a: Array }, options, { a: [ 1, 2 ] });
		validateMap('testProp', { a: Object }, options, { a: { c: 1 } });
		validateMap('testProp', { a: Symbol }, options, { a: Symbol.iterator });

		validateMap('testProp', { a: { type: Number } }, options, { a: 1 });
		validateMap('testProp', { a: { type: String } }, options, { a: '1' });
		validateMap('testProp', { a: { type: Boolean } }, options, { a: true });
		validateMap('testProp', { a: { type: Array } }, options, { a: [ 1, 2 ] });
		validateMap('testProp', { a: { type: Object } }, options, {
			a: { c: 1 }
		});
		validateMap('testProp', { a: { type: Symbol } }, options, {
			a: Symbol.iterator
		});

		expect(validateValue).toBeCalledTimes(12);
		expect(validateObject).not.toBeCalled();

		// @ts-ignore
		validateValue.mockReset();
	}
);

test('validateMap should invoke validateObject and itself recursively if validator is an object.', () => {
	const mock = jest.spyOn(validateMapExport, 'default');
	validateMap('testProp', { a: {} }, options, { a: {} });
	expect(validateObject).toBeCalled();
	expect(mock).toBeCalledTimes(2);
});

test('validateMap should invoke validateList if validator is an array.', () => {
	validateMap('testProp', { a: [ String ] }, options, { a: [ 'Hello' ] });
	expect(validateList).toBeCalledWith('testProp.a', String, {}, [ 'Hello' ]);
});

test('validateMap should throw an error if property on the blueprint is not of a valid type.', () => {
	const validateFn = () => validateMap('testProp', { a: 1 }, options, { a: 1 });
	expect(validateFn).toThrowError(
		`Unsuported blueprint type for the property 'testProp.a' (number).` +
			` Check the documentation for the supported blueprint types.`
	);
});

test('validateMap should invoke validate function (if provided) with the property name and the provided value.', () => {
	const validateTest = jest.fn();

	validateMap('testProp', { a: Number }, { validate: validateTest }, { a: 1 });
	expect(validateTest).toBeCalledWith('testProp', { a: 1 });

	validateMap('testProp2', { a: Number }, { validate: validateTest }, { a: 2 });
	expect(validateTest).toBeCalledWith('testProp2', { a: 2 });
});

test('validateMap should throw an error if provided validate property is not a function.', () => {
	const val1: any = 'string';
	const fnStr = () => validateMap('testProp', { a: Number }, { validate: val1 }, { a: 1 });
	expect(fnStr).toThrowError('Validator for the property testProp should be a function, string found instead.');

	const val2: any = 1;
	const fnNum = () => validateMap('testProp', { a: Number }, { validate: val2 }, { a: 1 });
	expect(fnNum).toThrowError('Validator for the property testProp should be a function, number found instead.');

	const val3: any = true;
	const fnBool = () => validateMap('testProp', { a: Number }, { validate: val3 }, { a: 1 });
	expect(fnBool).toThrowError('Validator for the property testProp should be a function, boolean found instead.');

	const val4: any = Symbol.iterator;
	const fnSym = () => validateMap('testProp', { a: Number }, { validate: val4 }, { a: 1 });
	expect(fnSym).toThrowError('Validator for the property testProp should be a function, symbol found instead.');

	const val5: any = [];
	const fnArr = () => validateMap('testProp', { a: Number }, { validate: val5 }, { a: 1 });
	expect(fnArr).toThrowError('Validator for the property testProp should be a function, array found instead.');

	const val6: any = {};
	const fnObj = () => validateMap('testProp', { a: Number }, { validate: val6 }, { a: 1 });
	expect(fnObj).toThrowError('Validator for the property testProp should be a function, object found instead.');
});
