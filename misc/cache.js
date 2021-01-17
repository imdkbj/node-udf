const cacheManager = require("cache-manager");
var fsStore = require('cache-manager-fs');

const initCache = () =>
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



class Cache {
    constructor(params) {
        this.params = params;
    }

    setgetCache = async (key, ttl, cb) => {
        try {
            await initCache();
            return memoryCache.wrap(key, async () => await eval(cb), {
                ttl: ttl
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

module.exports = Cache;