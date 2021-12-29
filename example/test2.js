const _udf = require('../index.js');
// const conn = require('./db.js');

const cacheManager = require("cache-manager");
var fsStore = require('cache-manager-fs');

let nodeUDF = new _udf();

let {
    convertToTradingSymbol,
    validateOrderInput,
    download,
    getsetCache
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
    let cb = () => {
        console.log('called');
        return new Date();
    }

    let x = await getsetCache('k', 10, cb);

    console.log(x);
}

test3()

const initCache2 = () =>
    new Promise((resolve, reject) => {
        memoryCache = cacheManager.caching({
            store: fsStore,
            path: 'cache',
            ttl: 30,
            preventfill: false,
            reviveBuffers: false,
            fillcallback: data => {
                resolve()
            }
        })
    })


getsetCache2 = async (key, ttl, cb) => {
    let _this = this;
    try {
        await _this.initCache();
        return memoryCache.wrap(key, async () => await cb(), {
            ttl: ttl
        });
    } catch (err) {
        throw new Error(err);
    }
}



async function test4() {
    let cb = () => {
        console.log('called');
        return new Date();
    }

    await initCache2();
    let x = await getsetCache2('k', 10, cb);

    console.log(x);
}

test4()