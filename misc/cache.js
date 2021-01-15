const NodeCache = require("node-cache");

class Cache extends NodeCache {
    constructor(params) {
        super(params);
        this.params = params;
    }

    getData = (keys) => {
        let _this = this;
        let cache = Array.isArray(keys) ? _this.mget(keys) : _this.get(keys);

        // let cache = 

        //     Object.assign(cache, {
        //         _key: val
        //     });
        // }

        return [cache];
    }


    getsetData = async (arr, ttl, cb, arg) => {
        let _this = this;
        let all_data = [await _this.mget(arr)];
        console.log(_this.keys());

        let _ttl = (i) => Array.isArray(ttl) ? ttl[i] : ttl;
        let process_data = all_data.map((data, i) => {
            if (Object.keys(data).length == 0) {
                //get the data
                let _data = new Date();
                //cb(arg);

                //store this
                _this.set(arr[i], _data, _ttl(i));

                //return data
                return _data;
            } else {
                return data;
            }
        })
        console.log(_this.keys());

        return process_data;
    }
}

module.exports = Cache;