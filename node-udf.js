const Many = require('extends-classes');
const StringUDF = require("./string_udf/stringUDF");
const Table = require('./string_udf/table');
const InputValidation = require("./algo/validation/validation");
const ConvertToSymbol = require("./algo/validation/convertsymbol");
const SqlUDF = require('./dbfn/sqlUDF');

class UDF extends Many(StringUDF, Table, InputValidation, ConvertToSymbol, SqlUDF) {
    constructor(params) {
        super(params)
        this.params = params;
    }

    delay = (ms) => new Promise((res) => setTimeout(res, ms))

    __call(method, args) {
        console.log(`'${method}()'doesn\'t exists!`);
    }
}

module.exports = UDF