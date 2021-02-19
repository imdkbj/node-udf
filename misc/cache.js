const cacheManager = require("cache-manager");
var fsStore = require('cache-manager-fs');

const _initCache = () =>
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

    initCache = () => _initCache();

    getsetCache = async (key, ttl, cb) => {
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

}

module.exports = Cache;