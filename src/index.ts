interface KeyValue {
   [key: string]: any;
}

class Blueprint {
   _schema: KeyValue;

   constructor (schema: KeyValue) {
      this._schema = schema;
   }

   create (schema: KeyValue) {
      return new Blueprint(schema);
   }

   validate (data: KeyValue) {}
}

export default Blueprint;
