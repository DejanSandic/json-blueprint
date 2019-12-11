import Blueprint from '../src';

test('Intergration test should not throw error.', () => {
   const bp = new Blueprint('Person', {
      name: String,
      age: Number,
      verified: {
         type: Boolean,
         required: false
      },
      phone: {
         ext: String,
         num: Number
      },
      a: {
         b: {
            c: String
         }
      },
      d: Object,
      tags: [
         {
            type: String
         }
      ],
      addresses: [
         [
            {
               number: Number,
               street: String
            }
         ]
      ]
   });

   bp.validate({
      name: 'Blue Moon',
      age: 1,
      phone: {
         ext: '065',
         num: 973020
      },
      a: {
         b: {
            c: '1'
         }
      },
      d: {
         c: 1
      },
      tags: ['1', '2', '3'],
      addresses: [
         [
            {
               number: 13,
               street: 'NPM'
            }
         ]
      ]
   });
});
