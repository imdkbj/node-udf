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

function ProperCase(text) {
    if (text.length > 0)
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    else {
        return " ";
    }
}

function isValidMobile(inputtext) {
    var regex = /^[6789]\d{9}$/;
    if (inputtext.match(regex)) {
        return true;
    } else {
        return false;
    }
}

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g);
    return (res !== null)
};

exports.alphanumeric = (text, isSpaceAllowed = false, isAlphaAllowed = true, isNumericAllowed = true, allowedChars = null) => {
    var isValid = false;
    isValid = isSpaceAllowed ? (/ /g).test(text) : isValid;
    isValid = isAlphaAllowed ? (/^[A-Za-z]+$/).test(text) : isValid;
    isValid = isNumericAllowed ? (/^[1-9]+$/).test(text) : isValid;
    isValid = allowedChars == null ? isValid : new RegExp(`\[${allowedChars}\]\+\$`).test(text);
    return isValid;
}

exports.to_Buffer = (str) => Buffer.from(str).toString("base64");
exports.to_STR = (str) => Buffer.from(str, 'base64').toString("utf8");