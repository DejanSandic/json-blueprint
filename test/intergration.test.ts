import Blueprint from '../src';
import { Any, Is } from '../src/types';

test('Intergration test should not throw error.', () => {
   const bp = new Blueprint('Person', {
      name: String,
      age: Number,
      gender: Any,
      planet: Is('earth'),
      yinOrYang: Is.oneOf('yin', 'yang'),
      favoriteNumber: Any.of(Number, String, { number: Number }, [Number]),
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
      planet: 'earth',
      yinOrYang: 'yin',
      favoriteNumber: [3],
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
