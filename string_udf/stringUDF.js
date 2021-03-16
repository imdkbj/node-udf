class stringUDFs {
    constructor() { }

    // ************************************************************************************************
    // stringToJSON
    //
    // This will convert a text string to a json based on custom delimeter and string break.
    // It will have three arguments.
    //      1. Pass the string which needs to be converted.
    //      2. Optional : del >> The delimeter for the string parse, default '\n'.
    //      3. Optional : txtSep >> The seperator to break and convert two string into key:value of the json, default '='.
    // Examples:
    //      stringToJSON(str); //str ='fname=deepak\nlname=kumar' , Output will be - {fname:'deepak',lname:'kumar'} 
    //      stringToJSON(str,','); //str ='fname=deepak,lname=kumar' , Output will be - {fname:'deepak',lname:'kumar'} 
    //      stringToJSON(str,';','-'); //str ='fname-deepak;lname-kumar' , Output will be - {fname:'deepak',lname:'kumar'}
    // ************************************************************************************************
    stringToJSON(userinput, del = '\n', txtSep = '=') {
        let inputString = userinput.replace(/ /g, '');
        var obj = {};

        var tar = inputString.replace(/^\{|\}$/g, "").split(del);
        for (var i = 0, cur, pair;
            (cur = tar[i]); i++) {
            pair = cur.split(txtSep);
            obj[pair[0].toLowerCase()] = /^\d*$/.test(pair[1]) ? +pair[1] : pair[1];
        }
        return obj;
    }

    // ************************************************************************************************
    // insertInToArray
    //
    // Insert a new value in array.
    // It will have three arguments.
    //      1. Pass the array.
    //      2. index >> Where new value have to insert.first index will be 0
    //      3. newItem >> The new value.
    // Examples:
    //      insertInToArray([0,1,2,4,5],3,3); //Output will be [0,1,2,3,4,5]
    //      insertInToArray(['A','C','D'],1,'B'); //Output will be ['A','B','C','D']

    // ************************************************************************************************
    insertInToArray(arr, index, newItem) {
        const newArr = [
            // part of the array before the specified index
            ...arr.slice(0, index),
            // inserted item
            newItem,
            // part of the array after the specified index
            ...arr.slice(index)
        ]
        return newArr;
    }

    // ************************************************************************************************
    // isAlphaNumeric
    //
    // This will validate the alphanumeric,symbols etc.
    // It will have 5 arguments where rest 4 are optional.
    //      1. Pass the text which need to validate.
    //      2. Optional : isSpaceAllowed >> Boolean true/false , default false
    //      3. Optional : isAlphaAllowed >> Boolean true/false , default true
    //      4. Optional : isNumericAllowed >> Boolean true/false , default true
    //      5. Optional : allowedChars >> Like as '-=/.,$^&I#)*{[}]\|' , default null
    //  Examples:
    //      isAlphaNumeric('abcdxtyz',false);  //Output will be - true;
    //      isAlphaNumeric('abcd xtyz',false);  //Output will be - false;
    //      isAlphaNumeric('abcd xtyz5245',true);  //Output will be - true;
    //      isAlphaNumeric('abcd xtyz5245',true,true,false);  //Output will be - false;
    //      isAlphaNumeric('abcd xtyz5245/',true,true,true);  //Output will be - false;
    //      isAlphaNumeric('abcd xtyz5245/',true,true,true,'&^');  //Output will be - false;
    //      isAlphaNumeric('abcd xtyz5245/',true,true,true,'/');  //Output will be - true;
    // ************************************************************************************************
    isAlphaNumeric(text, isSpaceAllowed = false, isAlphaAllowed = true,
        isNumericAllowed = true, allowedChars = undefined, maxLength = 100, minLength = 1) {
        var regex = "";

        regex = isSpaceAllowed ? regex += " " : regex;
        regex = isAlphaAllowed ? regex += 'A-Za-z' : regex;
        regex = isNumericAllowed ? regex += '1-9' : regex;
        regex = allowedChars ? regex : regex += allowedChars;
        if (regex == "") return false;

        let isValid = new RegExp(`\[${regex}\]\+\$`).test(text);
        return isValid;
    }

    // ************************************************************************************************
    // toBuffer
    //
    // This will convert string to buffer
    // It will have only one argument.
    //  Examples:
    //      toBuffer('abc');    //Output will be - YWJj
    // ************************************************************************************************
    toBuffer(str) {
        return Buffer.from(str).toString("base64");
    }

    // ************************************************************************************************
    // toSTR
    //
    // This will convert string to buffer
    // It will have only one argument.

    //  Examples:
    //      toSTR('abc');    //Output will be - abc
    // ************************************************************************************************
    toSTR(str) {
        return Buffer.from(str, 'base64').toString("utf8");
    }

    // ************************************************************************************************
    // properCase
    //
    // This will convert string to Propercase
    // It will have only one argument.
    //  Examples:
    //      properCase('abc');    //Output will be - Abc
    // ************************************************************************************************
    properCase(text) {
        let output = text.length > 0 ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : "";
        return output;
    }

    // ************************************************************************************************
    // isValidMobile
    //
    // This will check if input is a 10 digit mobile number
    // It will have only one argument.

    //  Examples:
    //      isValidMobile('1234567890');    //Output will be - false
    //      isValidMobile('9999999999');    //Output will be - true

    // ************************************************************************************************
    isValidMobile(mobile) {
        return (/^[6789]\d{9}$/).test(mobile);
    }

    // ************************************************************************************************
    // isValidURL
    //
    // This will check if input is a url string
    // It will have two argument.
    //      1. Pass the text which need to validate.
    //      2. Optional : isOnline >> default false, if true then will also check the online by making a POST request.
    //  Examples:
    //      isValidURL('zbkjbxzk');    //Output will be - false
    //      isValidMobile('https://google.com');    //Output will be - true
    //      isValidMobile('google.com');    //Output will be - true
    //      isValidMobile('www.google.com');    //Output will be - true
    //      isValidMobile('https://google.com/abc');    //Output will be - true
    //      isValidURL('zbkjbxzk',true);    //Output will be - false
    //      isValidMobile('www.google.com',true);    //Output will be - true

    // ************************************************************************************************
    isValidURL(string, isOnline = false) {
        var regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g;
        let isValid = regex.test(string);
        if (!isOnline) return isValid;
    }

    // ************************************************************************************************
    // exportArrayColumn
    //
    // This extract a column from multi-dimensional array
    // It will have two argument.
    //      1. Pass the multi-dimensional array.
    //      2. col >> the column number which needs to be exported.

    //  Examples:
    //      exportArrayColumn([[1,2,3]],1);    //Output will be - [2]

    // ************************************************************************************************
    exportArrayColumn(arr, n) {
        return arr.map((x) => x[n]);
    }

    // ************************************************************************************************
    // isObject
    //
    // Check if the value is Object or not 
    // (Value could be String object, Number Object, Array Object, Date object etc.)
    //
    // Examples:
    //     isObject(null); // returns true
    //     isObject(new Number(5)); // returns true
    //     isObject({}); // returns true
    //     isObject(new Array(7, 11)); // returns true
    //     isObject(''); // returns false
    //
    // ************************************************************************************************
    isObject(value) {
        return (typeof value === 'object' && value !== null);
    }

    // ************************************************************************************************
    // isNumeric
    //
    // Check if the string is a number
    //
    // Examples:
    //      isNumeric('7') // returns true
    //      isNumeric('17.87') // returns true
    //      isNumeric('\t\t') // returns false
    //      isNumeric(-Infinity) // returns true
    //      isNumeric(false) // returns false
    //
    // ************************************************************************************************
    isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
        //return (Object.prototype.toString.call(value) === '[object Number]');
    }

    // ************************************************************************************************
    // isNoValue
    //
    // Check if the value is null
    //
    // Examples :
    //      isNoValue() // returns true
    //      isNoValue(undefined) // returns true
    //      isNoValue(null) // returns true
    //      isNoValue(0/0) // returns true
    //      isNoValue(false) // returns false
    //      isNoValue(new Object()) // returns true
    //
    // ************************************************************************************************
    isNoValue(value) {
        return (value === null || value || typeof value === 'undefined' || (isNaN(value) && !value.length));
    }

    objectToArray = (data) => Array.isArray(data) ? data : [data];

    deleteColumns(arr, col = 0) {
        if (col == 0) throw new Error('Argument col must not be zero.');
        if (col > arr[0].length) throw new Error('Delete column is greater than arr columns.');

        let _arr = [...arr];
        _arr = _arr.map((rows) => rows.filter((_, i) => i !== col));
        return _arr;
    }

    csvToArray(strData, strDelimiter = ",") {

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            // Delimiters.
            "(\\" +
            strDelimiter +
            "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            '(?:"([^"]*(?:""[^"]*)*)"|' +
            // Standard fields.
            '([^"\\' +
            strDelimiter +
            "\\r\\n]*))",
            "gi"
        );

        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [
            []
        ];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;

        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while ((arrMatches = objPattern.exec(strData))) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
            } else {
                // We found a non-quoted value.
                strMatchedValue = arrMatches[3];
            }

            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }

        // Return the parsed data.
        return arrData;
    }
}


module.exports = stringUDFs