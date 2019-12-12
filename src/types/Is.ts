export function Is (expected: any) {
   return function (prop: string, value: any, options?: any) {
      // If expected is an object, cast the it to the string
      expected = typeof expected === 'object' ? JSON.stringify(expected) : expected;

      // If value is an object, cast the it to the string
      value = typeof value === 'object' ? JSON.stringify(value) : value;

      if (expected !== value) {
         throw new Error(`Wrong value recieved for the property ${prop}. Expected: ${expected}, recieved: ${value}`);
      }
   };
}

Is.oneOf = function (...expectedValues: any[]) {
   return function (prop: string, value: any, options?: any) {
      // Cast all objects into strings
      expectedValues = expectedValues.map(expected =>
         typeof expected === 'object' ? JSON.stringify(expected) : expected
      );

      // If value is an object, cast the it to the string
      value = typeof value === 'object' ? JSON.stringify(value) : value;

      // Compare each expected value to the provided value
      const matched = expectedValues.filter(expected => expected === value);

      if (!matched.length) {
         throw new Error(
            `Wrong value recieved for the property ${prop}.` +
               ` Expected: ( ${expectedValues.join(' | ')} ), recieved: ${value}`
         );
      }
   };
};
