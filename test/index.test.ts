import Blueprint from '../src';

// Import inner functions used by the Blueprint
import * as validateObjectExport from '../src/validators/validateObject';
import * as validateMapExport from '../src/validators/validateMap';

const nameAndAgeBlueprint = {
   name: String,
   age: Number
};

const nameAndAge = {
   name: 'Blue Moon',
   age: 1
};

test(
   'Calling new Blueprint and Blueprint.create should invoke validateObject' +
      ' function and create new blueprint instance.',
   () => {
      const validateObject = jest.spyOn(validateObjectExport, 'default');
      const blueprint = new Blueprint(nameAndAgeBlueprint);
      expect(blueprint._blueprint).toBe(nameAndAgeBlueprint);

      const blueprint2 = Blueprint.create(nameAndAgeBlueprint);
      expect(blueprint2._blueprint).toBe(nameAndAgeBlueprint);

      expect(validateObject).toBeCalledTimes(2);
   }
);

test('Calling new Blueprint should throw an error if provided blueprint is undefined.', () => {
   const val: any = undefined;
   const fn = () => new Blueprint(val);
   expect(fn).toThrowError('Type of blueprint is expected to be an object, undefined found instead.');
});

test('Calling validate() method should throw an error if provided data is undefined.', () => {
   const blueprint = new Blueprint(nameAndAgeBlueprint);
   const val: any = undefined;
   const fn = () => blueprint.validate(val);
   expect(fn).toThrowError(
      'Type of data provided to the Blueprint.validate()' +
         ' function is expected to be an object, undefined found instead.'
   );
});

test('Calling validate() method should invoke validateObject and validateMap functions if provided data is an object.', () => {
   const validateObject = jest.spyOn(validateObjectExport, 'default');
   const validateMap = jest.spyOn(validateMapExport, 'default');

   const blueprint = new Blueprint(nameAndAgeBlueprint);
   blueprint.validate(nameAndAge);

   expect(validateObject).toBeCalledWith('data provided to the Blueprint.validate() function', {}, nameAndAge);
   expect(validateMap).toBeCalledWith(null, blueprint._blueprint, {}, nameAndAge);
});
