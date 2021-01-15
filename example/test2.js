const _udf = require('../index.js');
const conn = require('./db.js');

let nodeUDF = new _udf();

let {
    convertToTradingSymbol,
    validateOrderInput,
    download
} = nodeUDF;


const testme = async () => {
    try {
        let x = await validateOrderInput({
            symbol: 'ACC',
            action: 'BUY',
            type: "MIS",
            price: 'c',
            trigger: 0,
            qty: 1,
            sl: 10,
            tgt: 20,
            tsl: 0,
            exchange: 'NSE',
            comment: 'TEST'
        });
        console.log(x)
    } catch (e) {
        console.log(e);
    }
}


const test2 = async () => {
    try {
        let sql = 'select * from users_db';
        let result = await nodeUDF.sqlQuery(sql, [], false, conn);
        let r = nodeUDF.convertToTable(result, ['id', 'client', 'password', 'api_key'], true, false, " | ", decimalLengths = 0, stringSplitter = ",", bunkColumn = 0, isfixedformat = false, false);

        console.log(r);

    } catch (e) {
        console.log(e);
    }
}



// const NodeCache = require("node-cache");
// const myCache = new NodeCache()

async function test3() {
    let x = await nodeUDF.getsetData(['k'], 100);

    console.log(x);
}

test2()