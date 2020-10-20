const _udf = require('../node-udf.js');

let udf = new _udf();

const delay = async () => {
    console.log('Hello1');
    await udf.delay(2000);
    console.log('Hello after 2 sec');
}

const stringToJSON = () => {
    let output = udf.stringToJSON('fname=deepak\nlname=kumar');
    console.log(output);
}

const isAlphaNumeric = () => {
    let output = udf.isAlphaNumeric('abcdxtyz', false);
    console.log(output);
}

const insertInToArray = () => {
    let output = udf.insertInToArray(['A', 'C', 'D'], 1, 'B');
    console.log(output);
}

const convertToTradingSymbol = () => {
    let output = udf.convertToTradingSymbol('CRUDEOIL OCT FUT');
    console.log(output);
}

const toBuffer = () => {
    let output = udf.toBuffer('abc');
    console.log(output);
}

const toSTR = () => {
    let output = udf.toSTR('YWJj');
    console.log(output);
}

const properCase = () => {
    let output = udf.properCase('YWJj');
    console.log(output);
}

const convertToTable = async () => {
    try {
        console.log(udf.prototype);
        let output = await udf.convertToTable(msg_arr, null, false, false, " ");
        console.log(output);
    } catch (e) {
        console.log(e);
    }
}


let msg_arr = [
    ['Telegram ID', 'user_telegram_id'],
    ['Name', 'toSTR(userfullname)'],
    ['Mobile', 'mobile'],
    ['Email', 'emailid'],
    ['Payment', 'pg'],
    ['Amount', 'rupee + amt'],
    ['Validity', 'days' + ' days']
];


convertToTable();