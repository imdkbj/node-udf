var udf = exports;
let stringUDFs = require("./string_udf/stringUDF");

// ************************************************************************************************
// delay
//
// A promise delay/wait for the specified miliseconds
//
// Examples:
//     await delay(100); // Will wait for 100 miliseconds
//     await delay(3000); // Will wait for 1000 miliseconds that is equal to 3 seconds
//     (async () => await delay(1000))();//This is for non async function, https://developer.mozilla.org/en-US/docs/Glossary/IIFE

// ************************************************************************************************
udf.delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
udf.stringToJSON = (userinput, del, txtSep) => stringUDFs.string2JSON(userinput, del, txtSep);

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
udf.isAlphaNumeric = (text, isSpaceAllowed, isAlphaAllowed, isNumericAllowed, allowedChars) => stringUDFs.alphanumeric(text, isSpaceAllowed, isAlphaAllowed, isNumericAllowed, allowedChars);

// ************************************************************************************************
// toBuffer
//
// This will convert string to buffer
// It will have only one argument.

//  Examples:
//      toBuffer('abc');    //Output will be - 
// ************************************************************************************************
udf.toBuffer = (str) => stringUDFs.to_Buffer(str);

// ************************************************************************************************
// toSTR
//
// This will convert string to buffer
// It will have only one argument.

//  Examples:
//      toSTR('abc');    //Output will be - abc
// ************************************************************************************************
udf.toSTR = (str) => stringUDFs.to_STR(str);

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
udf.insertInToArray = (arr, index, newItem) => stringUDFs.insertToArray(arr, index, newItem);

// ************************************************************************************************
// validateOrderInput
//
// Validate the input of the order send on the bot.
// It will have two arguments.
// 1. Pass either object or string of the input.
// 2. Optional : type_arr >> This is optional Pass the array of order type.
// Examples:
// validateOrderInput(str,['INTRADAY', 'DELIVERY', 'MARGIN']); //Here order type will be validated as per array.
// validateOrderInput(str); //Here order type will not be validated.

// ************************************************************************************************
udf.validateOrderInput = (input_str_obj, type_arr) => require("./algo/validation/validation").validateInput(input_str_obj, type_arr);

// ************************************************************************************************
// convertToTradingSymbol
//
// Validate the input of the order send on the bot.
// It will have one arguments.
// 1. Pass the symbol.
// Examples:
// convertToTradingSymbol('NIFTY SEP FUT'); //Output will be - NIFTYSEP20FUT
// convertToTradingSymbol('NIFTY SEP 21 FUT'); //Output will be - NIFTYSEP21FUT

// Below both will have the same output.
// convertToTradingSymbol('NIFTY 1 OCT 11300 CE'); //Output will be - NIFTY20O0111300CE
// convertToTradingSymbol('NIFTY 1 OCT 20 11300 CE'); //Output will be - NIFTY20O0111300CE

// Below both will have the same output.
// convertToTradingSymbol('NIFTY OCT 20 11300 CE'); //Output will be - NIFTY20OCT11300CE
// convertToTradingSymbol('NIFTY OCT 11300 CE'); //Output will be - NIFTY20OCT11300CE

// convertToTradingSymbol('RELIANCE'); //Output will be - RELIANCE

// convertToTradingSymbol('USDINR 8 OCT 74.25 CE'); //Output will be - USDINR20O0874.25CE

// convertToTradingSymbol('CRUDEOIL OCT FUT'); //Output will be - CRUDEOIL20OCTFUT
// convertToTradingSymbol('CRUDEOIL OCT 21 FUT'); //Output will be - CRUDEOIL20OCTFUT

// ************************************************************************************************

udf.convertToTradingSymbol = (stringSymbol) => require("./algo/validation/convertsymbol").converttoATradingSymbol(stringSymbol);


// ************************************************************************************************
// sqlfunction
// ************************************************************************************************

udf.sqlQuery = (...arg) => require("./dbfn/sqlUDF").sqlProcess(...arg);

// ************************************************************************************************
// sqlQueryX
// ************************************************************************************************

udf.sqlQueryX = (...arg) => require("./dbfn/sqlUDF").sqlProcess2(...arg);