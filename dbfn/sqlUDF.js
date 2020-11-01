const StringUDF = require('../string_udf/stringUDF');
const cryptoRandomString = require("crypto-random-string");
const fs = require("fs");


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

    sql2CSV(sql, preResult = 0, file_id = null, path) {
        return new Promise(function (resolve, reject) {
            var values = [];
            var columns = [];

            let _file_id = file_id == null ? `csv_${cryptoRandomString({
                length: 10
            })}` : file_id;

            var filepath = `${path}${_file_id}.csv`;

            if (sql == null && preResult == 0) resolve(0);
            const promise = preResult == 0 ? sqlQuery(sql) : Promise.resolve(preResult);

            promise
                .then((result) => {
                    if (result != 0) {
                        var hdr = JSON.stringify(Object.keys(result[0])).replace(/(^\[)|(\]$)/gm, "");
                        var csv = result.map((d) => JSON.stringify(Object.values(d)))
                            .join("\n")
                            .replace(/(^\[)|(\]$)/gm, "");

                        fs.writeFile(filepath, `${hdr}\n${csv}`, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(filepath);
                            }
                        });
                    } else {
                        return Promise.reject("No data found for query.");
                    }
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

}


module.exports = SQLFn