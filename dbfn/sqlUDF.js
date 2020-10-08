const StringUDF = require('../string_udf/stringUDF');
//this will read/insert/update/delete in table
class SQLFn extends StringUDF {
    constructor(params = {
        con: undefined
    }) {
        super()
        this.con = params.con;
    }

    sqlQuery = (sql, values, isRejectPromise = false, con = undefined) => {
        let _this = this;
        return new Promise(function (resolve, reject) {
            let sqlcon = con == undefined ? _this.con : con;
            if (sqlcon == undefined || !_this.isObject(sqlcon)) reject('SQL connection not found.');

            sqlcon.query(sql, [values], function (err, result) {
                if (err)
                    reject(err);

                if (result == "undefined" || typeof result === "undefined")
                    reject('SQL mode - one query. SQL result error.\n' + result);

                if (result != 0) {
                    resolve(result);
                } else {
                    if (isRejectPromise) {
                        reject(0);
                    } else {
                        resolve(0);
                    }
                }
            });
        })
    }

    sqlQuery2 = (sql, con) => {
        let _this = this;
        return new Promise(function (resolve, reject) {
            let sqlcon = con == undefined ? _this.con : con;
            if (sqlcon == undefined || !_this.isObject(sqlcon)) reject('SQL connection not found.');

            sqlcon.query(sql, function (err, result) {
                if (err)
                    reject(err);

                if (result == "undefined" || typeof result === "undefined")
                    reject('SQL mode - multiple query. SQL result error.\n' + result);

                resolve(result);
            });
        });
    }
}


module.exports = SQLFn