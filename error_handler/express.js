class ExpressError {
    constructor() {

    }

    // ************************************************************************************************
    // handleError
    //
    // Handle Error
    // It will have 4 argument.
    //      1. Pass the error. 
    //      2. res >> Pass the express js response to reply to the sender.
    //      3. Optional : logMe >> default true, Log the error
    //      4. Optional : msg >> default undefined , Custom error message to reply; et.
    //
    //  Examples:
    //      
    // ************************************************************************************************
    expressHandleError = (error, res, logMe = true, msg = undefined) => {
        if (logMe) {
            console.log('handleError', error)
        }
        return res.status(400).json({ status: false, message: msg ? msg : 'Error occurred, Check log for more info.', error: "Error" + error });
    }

    expressShowInfo = ({ originalUrl, body, params, file, files }, res, next) => {
        console.log('originalUrl', originalUrl);
        console.log('body', body);
        if (params) console.log('params', params);
        if (file) console.log('file', file);
        if (files) console.log('file', files);
        return next();
    };
}