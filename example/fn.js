const cacheManager = require("cache-manager");
let fsStore = require('cache-manager-fs');

const _cache = require('../misc/cache.js');
let cache = new _cache();

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
        await initCache2();
        return memoryCache.wrap(key, async () => await cb(), {
            ttl: ttl
        });
    } catch (err) {
        throw new Error(err);
    }
}


let cb = () => {
    console.log('called');
    return new Date();
}

async function test_class(key) {
    let x = await cache.getsetCache(key, 10, cb);
    console.log(key, x);
}

async function test_fn(key) {
    let x = await getsetCache2(key, 10, cb);
    console.log(key, x);
}


test_class('test_class');
test_fn('test_fn')