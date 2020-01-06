# json-blueprint
JSON validation library

# Quick look
```js
import Blueprint from 'json-blueprint';

const person = new Blueprint('Test', {
   name: String,
   age: Number,
   verified: Boolean,
   phone: {
      ext: {
         type: String,
         maxLength: 5
      },
      number: Any.of(Number, String)
   },
   intrests: [ String ],
   planet: Is('Earth'),
   season: Is.oneOf('summer', 'winter', 'spring', 'fall'),
   songs: Array,
   contacts: Object,
   data: Any
});

person.validate({ ...object });
```

# Installation
npm:
```bash
npm install json-blueprint
```

yarn:
```bash
yarn add json-blueprint
```

# Usage
```js
// Import the library
import Blueprint from 'json-blueprint';

// Create new blueprint
const bp = new Blueprint('BlueprintName', {...schema});

// or
const bp = Blueprint.create('BlueprintName' {...schema});


// Validate data
bp.validate({...data})
```

# Table of contents
-  [String](#strings)
-  [Number](#number)
-  [Boolean](#boolean)
-  [Object](#Object)
-  [Array](#Array)
-  [Tuple](#Tuple)
-  [Any and Any.of](#any)
-  [Is and Is.oneOf](#is)
-  [Custom types](#custom)


<a id="string"></a>
# String

```js
import Blueprint from 'json-blueprint';

const bp = new Blueprint('Test', {
   // Basic string
   name: String,
   
   // String with options
   username: {
      type: String,
      minLength: 3,
      maxLength: 5,

      // Regex match
      match: /[^A-Za-z0-9]+/g,

      // Additional validation funciton
      validate: (prop, value) => {
         if (!value.includes('clown')) {
            throw new Error('Clowns are scary');
         }
      },

      // Property is required by default
      required: false
   }
});
```


<a id="number"></a>
# Number

```js
import Blueprint from 'json-blueprint';

const bp = new Blueprint('Test', {
   // Basic number
   age: Number,
   
   // Number with options
   poolNumber: {
      type: Number,
      min: 0,
      max: 15,

      // Additional validation funciton
      validate: (prop, value) => {
         if (value === 8) {
            throw new Error(`8-Ball not allowed for the property ${prop}`);
         }
      },

      // Property is required by default
      required: false
   }
});

```

<a id="boolean"></a>
# Boolean

```js
import Blueprint from 'json-blueprint';

const bp = new Blueprint('Test', {
   // Basic boolean
   loggedIn: Boolean,
   
   // Boolean with options
   verified: {
      type: Boolean,

      // Additional validation funciton
      validate: (prop, value) => {
         if (!value) {
            throw new Error('User is not verified');
         }
      },

      // Property is required by default
      required: false
   }
});
```

<a id="object"></a>
# Object

```js
import Blueprint from 'json-blueprint';

const bp = new Blueprint('Test', {
   // Basic object
   roles: Object,

   // Object with defined properties
   hours: {
      partTime: Boolean,
      fullTime: Boolean,
      preferredHours: Array
   },
   
   // Object with options
   permissions: {
      type: Object,

      // Additional validation funciton
      validate: (prop, value) => {
         const keys = Object.keys(value);

         if (!keys.includes('read')) {
            throw new Error(`${prop} is missing read permission`);
         }
      },

      // Property is required by default
      required: false
   },

   // Object with options and defined properties
   salary: {
      type: Object,
      required: false,
      items: {
         hourlyRate: Number,
         currency: String
      }
   }
});
```

<a id="array"></a>
# Array

```js
import Blueprint from 'json-blueprint';

const bp = new Blueprint('Test', {
   // Any array
   favoriteSongs: Array,

   // Array of strings
   favoriteMovies: [ String ],

   // Array of objects
   accounts: [
      {
         id: String,
         name: String
      }
   ],

   // Array of string arrays
   tasksTable: [
      [ String ]
   ],
   
   // Array with options
   hobies: {
      type: Array,
      minLength: 1,
      maxLength: 5,

      // Additional validation funciton
      validate: (prop, value) => {
         if (!value) {
            throw new Error('User is not verified');
         }
      },

      // Property is required by default
      required: false
   },

   // Array with options and defined items
   technologies: {
      type: Array,
      required: false,
      items: String
   },
   addresses: {
      type: Array,
      minLength: 1,
      items: {
         street: String,
         number: String
      }
   }
});
```

<a id="typle"></a>
# Tuple

```js
import Blueprint from 'json-blueprint';

const bp = new Blueprint('Test', {
   /**
    * Phone number tuple with extension and number
    * @param { string } [0]
    * @param { number } [1]
    */
   number: Tuple(String, Number)
});
```

<a id="any"></a>
# Any and Any.of

```js
import Blueprint from 'json-blueprint';

const bp = new Blueprint('Test', {
   // Any
   data: Any,

   // Any of the provided types
   apartmentNumber: Any.of(String, Number),

   phone: Any.of(String, Number, Tuple(String, Number), { ext: String, num: Number })
});
```

<a id="is"></a>
# Is and Is.oneOf

```js
import Blueprint from 'json-blueprint';

const bp = new Blueprint('Test', {
   // Any
   solarSystem: Is('Milky Way'),

   // Any of the provided types
   planet: Is.oneOf('Earth', 'Mars'),

   city: Is.oneOf('New York', [ 'New York' ], 10001, { country: 'USA', city: 'New York' });
});
```


<a id="custom"></a>
# Custom types

```js
import Blueprint from 'json-blueprint';

// Define custom type which checks is provided value truthy
function Truthy (prop, value) {
   if (!value) {
      throw new Error(`${prop} is not truthy`);
   }
}

// Create blueprint whcich implements custom type
const bp = new Blueprint('Test', {
   person: {
      happy: Truthy
   }
});

// Validate object
bp.validate({
   person: {
      happy: 0
      // Test.person.happy is not truthy
   }
})
```

Custom type with options

```js
import Blueprint from 'json-blueprint';

// Define custom type
function Truthy (prop, value, options) {
   const {
      a, // true
      b, // 1
      c, // 'hello'
      d  // { test: [] }
   } = options;

   if (!value) {
      throw new Error(`${prop} is not truthy`);
   }
}

// Create blueprint whcich implements custom type
const bp = new Blueprint('Test', {
   person: {
      happy: {
         type: Truthy,
         a: true,
         b: 1,
         c: 'hello',
         d: { test: [] }
      }
   }
});
```