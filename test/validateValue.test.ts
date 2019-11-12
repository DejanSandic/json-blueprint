import validateValue from '../src/validators/validateValue';

// Import inner functions used by the validateValue()
import validateString from '../src/validators/validateString';
import validateNumber from '../src/validators/validateNumber';
import validateBoolean from '../src/validators/validateBoolean';
import validateSymbol from '../src/validators/validateSymbol';
import validateObject from '../src/validators/validateObject';
import validateArray from '../src/validators/validateArray';
import validateMap from '../src/validators/validateMap';
import validateList from '../src/validators/validateList';

// Mock inner functions used by the validateValue()
jest.mock('../src/validators/validateString');
jest.mock('../src/validators/validateNumber');
jest.mock('../src/validators/validateBoolean');
jest.mock('../src/validators/validateSymbol');
jest.mock('../src/validators/validateObject');
jest.mock('../src/validators/validateArray');
jest.mock('../src/validators/validateMap');
jest.mock('../src/validators/validateList');

test('validateValue should call validateString function if the provided constructor is String.', () => {
	validateValue('testProp', String, {}, 'Helo world');
	expect(validateString).toBeCalledWith('testProp', {}, 'Helo world');
	expect(validateNumber).not.toBeCalled();
	expect(validateBoolean).not.toBeCalled();
	expect(validateSymbol).not.toBeCalled();
	expect(validateObject).not.toBeCalled();
	expect(validateArray).not.toBeCalled();
	expect(validateMap).not.toBeCalled();
	expect(validateList).not.toBeCalled();

	// @ts-ignore
	validateString.mockReset();
});

test('validateValue should call validateNumber function if the provided constructor is Number.', () => {
	validateValue('testProp', Number, {}, 1);
	expect(validateNumber).toBeCalledWith('testProp', {}, 1);
	expect(validateString).not.toBeCalled();
	expect(validateBoolean).not.toBeCalled();
	expect(validateSymbol).not.toBeCalled();
	expect(validateObject).not.toBeCalled();
	expect(validateArray).not.toBeCalled();
	expect(validateMap).not.toBeCalled();
	expect(validateList).not.toBeCalled();

	// @ts-ignore
	validateNumber.mockReset();
});

test('validateValue should call validateBoolean function if the provided constructor is Boolean.', () => {
	validateValue('testProp', Boolean, {}, true);
	expect(validateBoolean).toBeCalledWith('testProp', {}, true);
	expect(validateString).not.toBeCalled();
	expect(validateNumber).not.toBeCalled();
	expect(validateSymbol).not.toBeCalled();
	expect(validateObject).not.toBeCalled();
	expect(validateArray).not.toBeCalled();
	expect(validateMap).not.toBeCalled();
	expect(validateList).not.toBeCalled();

	// @ts-ignore
	validateBoolean.mockReset();
});

test('validateValue should call validateSymbol function if the provided constructor is Symbol.', () => {
	validateValue('testProp', Symbol, {}, Symbol.iterator);
	expect(validateSymbol).toBeCalledWith('testProp', {}, Symbol.iterator);
	expect(validateString).not.toBeCalled();
	expect(validateNumber).not.toBeCalled();
	expect(validateBoolean).not.toBeCalled();
	expect(validateObject).not.toBeCalled();
	expect(validateArray).not.toBeCalled();
	expect(validateMap).not.toBeCalled();
	expect(validateList).not.toBeCalled();

	// @ts-ignore
	validateSymbol.mockReset();
});

test('validateValue should call validateObject function if the provided constructor is Object.', () => {
	validateValue('testProp', Object, {}, {});
	expect(validateObject).toBeCalledWith('testProp', {}, {});
	expect(validateString).not.toBeCalled();
	expect(validateNumber).not.toBeCalled();
	expect(validateBoolean).not.toBeCalled();
	expect(validateSymbol).not.toBeCalled();
	expect(validateArray).not.toBeCalled();
	expect(validateMap).not.toBeCalled();
	expect(validateList).not.toBeCalled();

	// @ts-ignore
	validateObject.mockReset();
});

test('validateValue should call validateArray function if the provided constructor is Array.', () => {
	validateValue('testProp', Array, {}, [ 1, 2 ]);
	expect(validateArray).toBeCalledWith('testProp', {}, [ 1, 2 ]);
	expect(validateString).not.toBeCalled();
	expect(validateNumber).not.toBeCalled();
	expect(validateBoolean).not.toBeCalled();
	expect(validateSymbol).not.toBeCalled();
	expect(validateObject).not.toBeCalled();
	expect(validateMap).not.toBeCalled();
	expect(validateList).not.toBeCalled();

	// @ts-ignore
	validateArray.mockReset();
});

test(
	'validateValue should call validateMap function if the provided constructor is Object' +
		' and items property exists on the opitons object.',
	() => {
		validateValue('testProp', Object, { items: { a: String } }, { a: 1 });
		expect(validateMap).toBeCalledWith('testProp', { a: String }, {}, { a: 1 });
		expect(validateString).not.toBeCalled();
		expect(validateNumber).not.toBeCalled();
		expect(validateBoolean).not.toBeCalled();
		expect(validateSymbol).not.toBeCalled();
		expect(validateObject).not.toBeCalled();
		expect(validateArray).not.toBeCalled();
		expect(validateList).not.toBeCalled();

		// @ts-ignore
		validateMap.mockReset();
	}
);

test(
	'validateValue should call validateList function if the provided constructor is Array' +
		' and items property exists on the opitons object.',
	() => {
		validateValue('testProp', Array, { items: [ String ] }, [ 'Hello', 'World' ]);
		expect(validateList).toBeCalledWith('testProp', [ String ], {}, [ 'Hello', 'World' ]);
		expect(validateString).not.toBeCalled();
		expect(validateNumber).not.toBeCalled();
		expect(validateBoolean).not.toBeCalled();
		expect(validateSymbol).not.toBeCalled();
		expect(validateObject).not.toBeCalled();
		expect(validateArray).not.toBeCalled();
		expect(validateMap).not.toBeCalled();

		// @ts-ignore
		validateList.mockReset();
	}
);
