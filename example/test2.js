const _udf = require('../index.js');
let {convertToTradingSymbol,validateOrderInput} =  new _udf();

const testme = async() => {
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


testme();

//USDINR2110173CE