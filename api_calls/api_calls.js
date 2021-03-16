const axios = require('axios');
const qs = require('qs');
const stringUDFs = require('../string_udf/stringUDF');

class Calls extends stringUDFs {
    constructor(baseURL, headers) {
        super()
        this.baseURL = baseURL;
        this.headers = headers;
    }

    // ************************************************************************************************
    // getAxiosData
    //
    // This will be get data via api calls
    // It will have six argument.
    //      1. Pass the endpoint route : >> Like as /public/data 
    //      2. Optional : data >> default undefined, Pass the post body data
    //      3. Optional : urlencoded >> default true, Pass false if you have another type of post body data
    //      4. Optional : headers >> default will pickup from base constructor; 
    //      5. Optional : base_URL >> default will pickup from base constructor; 
    //      6. Optional : method >> default post, Pass the api call method like as get.
    //
    //  Examples:
    //      

    // ************************************************************************************************
    getAxiosData = async (route, data = undefined, urlencoded = true, headers = undefined, base_URL = undefined, method = "post") => {
        let _this = this;

        let _baseURL = base_URL ? base_URL : _this.baseURL;
        let url = _baseURL + route
        let _headers = headers ? headers : this.headers ? this.headers : {};
        let _data = urlencoded && data ? qs.stringify(data) : data;

        //isValidURL
        if (!_this.isValidURL(url)) return { status: false, error: 'Invalid url.' };

        let config = {
            method,
            url,
            headers: _headers,
            data: _data
        };

        try {
            let data = await axios(config);
            return { status: true, data };
        } catch (e) {
            return { status: false, data: undefined, error: "Error" + e };
        }
    }
}

module.exports = Calls