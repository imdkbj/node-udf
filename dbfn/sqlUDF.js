//this will read/insert/update/delete in table
function sqlProcess(sqlcon, sql, values, isRejectPromise = false) {
    return new Promise(function (resolve, reject) {
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
    });
}

function sqlProcess2(sqlcon, sql) {
    return new Promise(function (resolve, reject) {
        sqlcon.query(sql, function (err, result) {
            if (err)
                reject(err);

            if (result == "undefined" || typeof result === "undefined")
                reject('SQL mode - multiple query. SQL result error.\n' + result);
            resolve(result);
        });
    });
}

module.exports = {
    sqlProcess,
    sqlProcess2
}