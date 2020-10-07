const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');
const PDFImage = require("pdf-image").PDFImage;
const dateFormat = require('dateformat');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = './token.json';

const udf = require(`./udf.js`);
const connection = require(`./connection.js`);
const spbackendsheet = connection.spbackendsheet;

function authorize() {
    return new Promise(function (resolve, reject) {
        readcredentials()
        .then(credentials => {
            return readfromTOKEN(credentials);
        })
        .then(oAuth2Client => {
            if (oAuth2Client.status == 'ERR') {
                return getNewToken(oAuth2Client.auth);
            } else {
                return (oAuth2Client);
            }
        })
        .then(oAuth => {
            resolve(oAuth.auth);
        })
        .catch(e => {
            reject(e);
        })
    });
}

function readcredentials() {
    return new Promise(function (resolve, reject) {
        fs.readFile('./credentials.json', (err, content) => {
            if (err) {
                reject('Error loading client secret file:');
            } else {
                resolve(JSON.parse(content));
            }
        });
    });
}

function readfromTOKEN(credentials) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

    return new Promise(function (resolve, reject) {
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                resolve({
                    status: "ERR",
                    auth: oAuth2Client
                });
            } else {
                oAuth2Client.setCredentials(JSON.parse(token));

                resolve({
                    status: "OK",
                    auth: oAuth2Client
                });
            }
        });
    });
}

function getNewToken(oAuth2Client) {
    return new Promise(function (resolve, reject) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err)
                    reject('Error while trying to retrieve access token');
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err)
                        reject(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                resolve({
                    auth: oAuth2Client
                });
            });
        });
    });
}

function sheetOBJ(auth) {
    return google.sheets({
        version: 'v4',
        auth
    });
}

function pushDatatoGoogleSheet(spreadsheetId, range, values, isclearOld, clrRange) {
    return new Promise(function (resolve, reject) {
        authorize()
        .then(auth => {
            const sheets = google.sheets({
                version: 'v4',
                auth
            });
            if (isclearOld) {
                return clearAndPushData(sheets, spreadsheetId, range, values, clrRange);
            } else {
                return insertData(sheets, spreadsheetId, range, values);
            }
        })
        .then(response => {
            resolve(response);
        })
        .catch(e => {
            reject(e);
        })
    });
}

function clearAndPushData(sheets, spreadsheetId, range, values, clrRange) {
    return new Promise(function (resolve, reject) {

        var rngToClr = clrRange != null ? clrRange : range;
        clearSheet(sheets, spreadsheetId, rngToClr)
        .then(() => {
            return insertData(sheets, spreadsheetId, range, values);
        })
        .then(() => {
            resolve(`${range} updated to google sheet.`);
        })
        .catch(e => {
            reject(e);
        })
    });
}

function clearSheet(sheets, spreadsheetId, range) {
    return new Promise(function (resolve, reject) {

        var _range = range != null ? range : 'A1:BZ';

        sheets.spreadsheets.values.clear({
            spreadsheetId: spreadsheetId,
            range: _range,
            resource: {},
        }, function (err, response) {
            if (err) {
                reject(err);
            }
            resolve(response);
        });
    });
}

function insertData(sheets, spreadsheetId, range, values) {
    return new Promise(function (resolve, reject) {

        sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: values
            }
        }, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

function appendData(sheets, spreadsheetId, range, values) {
    return new Promise(function (resolve, reject) {

        sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: "USER_ENTERED",
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: values
            }
        }, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

function googleSheet2SQL(spreadsheetId, range, sql, sql_db) {
    return new Promise(function (resolve, reject) {
        var _spreadsheetId = spreadsheetId == null ? spbackendsheet : spreadsheetId;

        authorize()
        .then(auth => {
            var sheets = sheetOBJ(auth);
            return readValuesfromSheet(sheets, _spreadsheetId, range);
        })
        .then(read_data => writeData2SQL(sql, read_data, sql_db))
        .then(data => resolve(data))
        .catch(e => reject(e))
    });
}




function readValuesfromSheet(sheets,spreadsheetId,range){
	return new Promise(function(resolve, reject){	
	     sheets.spreadsheets.values.get({
	      spreadsheetId: spreadsheetId,
	      range: range
	    }, function(err, response) {
	        if (err) {
				console.log('err', err);
				reject (err);
	        }else{
				resolve(response.data.values);
			}
		})
	});
}

/* 
function readValuesfromSheet(sheets, spreadsheetId, range) {
    return new Promise(function (resolve, reject) {

        console.log('readValuesfromSheet')
		
        const _input = {
            spreadsheetId: spreadsheetId,
            range: range
        }

        sheets.spreadsheets.values.get(_input)
        .then((response) => {
            console.log('response', response)
            // resolve(response.data.values);
        })
        .catch((e) => {
            console.log(e)
            reject(e)
        })
    });
}
 */
function writeData2SQL(sql, read_data, sql_db) {
    return new Promise(function (resolve, reject) {
        udf.insertSQL(sql, read_data, sql_db)
        .then(() => {
            resolve('sql updated from google sheet.');
        })
        .catch(e => {
            reject(e);
        })
    });
}

async function downloadfromDrive(fileId, destname) {
    return new Promise(function (resolve, reject) {

        authorize()
        .then(auth => {

            const drive = google.drive({
                version: 'v3',
                auth
            });

            return drive.files.get({
                fileId: fileId,
                alt: 'media'
            }, {
                responseType: 'stream'
            },
                (err, {
                    data
                }) => {
                if (err) {
                    reject(err);
                } else {
                    data
                    .pipe(fs.createWriteStream(inputObject.destname))
                    .on('error', () => {
                        reject('Error in pipe file from GDrive.')
                    })
                    .on('finish', () => {
                        resolve(destname);
                    });
                }
            });
        })
        .catch(e => {
            reject(e);
        })
    });
}

function gsExport2PDF(spreadsheetId, sheetid, range, pdfFile) {

    authorize()
    .then(auth => {
        const sheets = google.sheets({
            version: 'v4',
            auth
        });

        return {
            token: auth.credentials.access_token,
            response: sheets.spreadsheets.get({
                spreadsheetId: spreadsheetId
            })
        }
    })
    .then(response => {
        var url = response.response.data.spreadsheetUrl;
        url = url.replace(/edit$/, '');
        var url_ext = 'export?exportFormat=pdf&format=pdf&size=LETTER&portrait=false&fitw=true&top_margin=0.75&bottom_margin=0.75&left_margin=0.7&right_margin=0.7&sheetnames=false&printtitle=false&pagenum=false&gridlines=true&fzr=FALSE&gid=';
        url = url + url_ext + sheetid;
        url = range != null ? url + range : url;

        var filePDF = fs.createWriteStream(pdfFile);

        var request = require('request');
        var headers = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'text/pdf'
            }
        }

        return stream2filePipe(filePDF, url, headers);

    })
    .then(piped => {
        resolve(piped);
    })
    .catch(e => {
        reject(e);
    })
}

function stream2filePipe(filePDF, url, headers, options) {
    return new Promise(function (resolve, reject) {
        request(url, headers, function (err, res, body) {
            if (err)
                reject(err);
            try {
                res.on('data', (d) => {});
                res.on('end', () => {
                    filePDF.end();
                })
                on('error', (e) => {
                    reject(e);
                })
                .pipe(filePDF)
                .on('finish', () => {
                    resolve(filePDF);
                });
            } catch (e) {
                reject(e);
            }

        });
    });
}

function gsExport2pdf2Image(spreadsheetId, sheetid, range, pdfFile, options) {
    return new Promise(function (resolve, reject) {
        gsExport2PDF(spreadsheetId, sheetid, range, pdfFile)
        .then(response => {
            return convert2img(response, options)
        })
        .then(done => {
            resolve(done);
        })
        .catch(e => {
            reject(e);
        })
    });
}

async function convert2img(pdfFile, options) {
    return new Promise(function (resolve, reject) {

        const pdfImage = new PDFImage(pdfFile, {
            imageMagick: true,
            convertOptions: options
        });

        pdfImage.convertPage(0)
        .then(resolve => {
            resolve(`${pdfFile} converted to image ${resolve}`);
        })
        .catch(e => {
            reject(e);
        })
    });
}

async function gsPDF2image(fileId, destname, options) {
    return new Promise(function (resolve, reject) {

        downloadfromDrive(fileId, destname)
        .then(response => {
            return convert2img(response, options)
        })
        .then(done => {
            resolve(done);
        })
        .catch(e => {
            reject(e);
        })
    });
}

function cleardaily(spreadsheetId, range) {
    return new Promise(function (resolve, reject) {
        var sheets;
        //read holiday
        authorize()
        .then(auth => {
            sheets = google.sheets({
                version: 'v4',
                auth
            });
            return readValuesfromSheet(sheets, spreadsheetId, range);
        })
        .then(response => {
            if (response == 1) {
                resolve('Today sheet data not cleared as holiday!');
            } else {
                var _v = [["instrument_token", " timestamp", "last_trade_time", "last_price", "buy_quantity", "sell_quantity", "volume", "oi", "oi_day_high", "oi_day_low", "net_change", "open", "high", "low", "close"]]

                clearAndPushData(sheets, spreadsheetId, `ohl5!A1:O`, _v)
                .then(() => clearAndPushData(sheets, spreadsheetId, `ohl15!A1:O`, _v))
                .then(() => clearAndPushData(sheets, spreadsheetId, `ohl30!A1:O`, _v))
                .then(() => clearAndPushData(sheets, spreadsheetId, `orb5!A1:O`, _v))
                .then(() => clearAndPushData(sheets, spreadsheetId, `orb15!A1:O`, _v))
                .then(() => clearAndPushData(sheets, spreadsheetId, `orb30!A1:O`, _v))
                .then(() => clearAndPushData(sheets, spreadsheetId, `livefo!A1:O`, _v))
                .then(() => clearAndPushData(sheets, spreadsheetId, `livefo!S1:T1`, [['Updated On', dateFormat(new Date(), 'default')]]))
                .then(() => resolve('Data flushed of all sheets.'))
                .catch(e => reject(e))
            }
        })
        .catch(e => {
            reject(e);
        })
    });
}

function pcrtimestamp(spreadsheetId, readrange, writerange, scrip, sql_db) {
    return new Promise(function (resolve, reject) {
        var sheets;
        var new_array;
        var _spreadsheetId = spreadsheetId != null ? spreadsheetId : spbackendsheet;

        authorize()
        .then(auth => {
            sheets = sheetOBJ(auth);
            return readValuesfromSheet(sheets, _spreadsheetId, readrange);
        })
        .then(values => {
            var now = new Date();
            new_array = values[0];
            new_array.unshift(dateFormat(now, "d mmm"), now.getTime(), scrip, dateFormat(now, "HH:MM"));

            return appendData(sheets, _spreadsheetId, writerange, [new_array]);
        })
        .then(() => {
            var sql = 'insert into pcr_db (date,time_unix,scrip,time,pcr,nearpcr,otmpcr,itmpcr,pe_itm_oi,ce_itm_oi,pe_otm_oi,ce_otm_oi,pe_oi,ce_oi,pe_near_oi,ce_near_oi,pe_chng_oi,ce_chng_oi,pe_near_chng_oi,ce_near_chng_oi) values ?';
            return writeData2SQL(sql, [new_array], sql_db);
        })
        .then(() => {
            resolve('OK');
        })
        .catch(e => {
            reject(e);
        })
    });
}

module.exports = {
    pushDatatoGoogleSheet,
    googleSheet2SQL,
    downloadfromDrive,
    gsExport2PDF,
    gsExport2pdf2Image,
    gsPDF2image,
    cleardaily,
    pcrtimestamp
}
