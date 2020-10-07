class GoogleSheets {
    constructor(params = {}) {
        this.fs = require('fs');
        this.readline = require('readline');
        this.google = require('googleapis').google;
        this.dateFormat = require('dateformat');
        this.PDFImage = require("pdf-image").PDFImage;
        this.SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.metadata.readonly'
        ];
        this.TOKEN_PATH = './token.json';
        //The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first time.
        this.udf = require(`./udf.js`);
        this.connection = require(`./connection.js`);
        const {
            version,
            spreadsheetId,
            range: {
                readRange,
                writeRange,
                clearRange
            }
        } = params;

        this.sheets = this.__getSheets();
    }

    __readcredentials() {
        return new Promise(function (resolve, reject) {
            fs.readFile(this.connection, (err, content) => {
                if (err) {
                    reject('Error loading client secret file:');
                } else {
                    resolve(JSON.parse(content));
                }
            });
        });
    }

    __readfromTOKEN(credentials) {
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

    __getNewToken(oAuth2Client) {
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


    __authorize() {
        return new Promise(function (resolve, reject) {
            __readcredentials()
                .then(credentials => {
                    return __readfromTOKEN(credentials);
                })
                .then(oAuth2Client => {
                    if (oAuth2Client.status == 'ERR') {
                        return getNewToken(oAuth2Client.auth);
                    } else {
                        return oAuth2Client;
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


    __sheetOBJ(auth) {
        return google.sheets({
            version: this.version,
            auth
        });
    }

    __getSheets() {
        return new Promise(function (resolve, reject) {
            authorize()
                .then(auth => __sheetOBJ(auth))
                .then(sheets => resolve(sheets))
                .catch(e => {
                    console.log(e)
                })
        })
    }

    //readValuesfromSheet(sheets,spreadsheetId,range){

    __readValuesfromSheet(newParams) {
        return new Promise(function (resolve, reject) {
            //            const sheets = authsheet == null ? __getSheets() : authsheet;
            const isEmpty = newParams == {};
            const userReadRange = isEmpty ? this.readRange : newParams.readRange;
            const userSpreadsheetId = isEmpty ? this.spreadsheetId : newParams.spreadsheetId;

            this.sheets.spreadsheets.values.get({
                spreadsheetId: userSpreadsheetId,
                range: userReadRange
            }, function (err, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve(response.data.values);
                }
            })
        });
    }

    readGS(params = {}) {
        this.

        return __readValuesfromSheet(params, params);
    }
}

module.exports = GoogleSheets;