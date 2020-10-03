exports.string2JSON = (userinput, del = '\n', txtSep = '=') => {
    let inputString = userinput.replace(/ /g, '');
    var obj = {};

    tar = inputString.replace(/^\{|\}$/g, "").split(del);
    for (var i = 0, cur, pair;
        (cur = tar[i]); i++) {
        pair = cur.split(txtSep);
        obj[pair[0].toLowerCase()] = /^\d*$/.test(pair[1]) ? +pair[1] : pair[1];
    }
    return obj;
}

exports.insertToArray = (arr, index, newItem) => [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index)
]

exports.alphanumeric = (text, isSpaceAllowed = false, isAlphaAllowed = true, isNumericAllowed = true, allowedChars = null) => {
    var regex = "";

    regex = isSpaceAllowed ? regex += " " : regex;
    regex = isAlphaAllowed ? regex += 'A-Za-z' : regex;
    regex = isNumericAllowed ? regex += '1-9' : regex;
    regex = allowedChars == null ? regex : regex += allowedChars;
    if (regex == "") return false;

    let isValid = new RegExp(`\[${regex}\]\+\$`).test(text);
    return isValid;
}

exports.to_Buffer = (str) => Buffer.from(str).toString("base64");
exports.to_STR = (str) => Buffer.from(str, 'base64').toString("utf8");

exports.proper_Case = (text) => {
    let output = text.length > 0 ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : " ";
    return output;
}

exports.is_ValidMobile = (mobile) => (/^[6789]\d{9}$/).test(mobile);

exports.is_ValidURL = (string, isOnline = false) => {
    var regex = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g);
    let isValid = regex.test(mobile);
    if (!isOnline || !isValid) return isValid;
}

const arrayColumn = (arr, n) => arr.map((x) => x[n]);
const rpt = (n, txt = ' ') => txt.repeat(n);