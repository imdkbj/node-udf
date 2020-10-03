const ratify = require("node-ratify");

const {
    insertToArray
} = require("../../string_udf/stringUDF");

exports.converttoATradingSymbol = (stringSymbol) => {
    let scrip = stringSymbol.toUpperCase().split(' ');

    //find fut/ce/pe
    let scriptype = scrip[scrip.length - 1];
    let isFO = scriptype == 'CE' || scriptype == 'PE' || scriptype == 'FUT';
    if (!isFO) return stringSymbol;

    //insert year in ce/pe
    scrip = insert_year(scrip, scriptype);

    //convert month as per weekly/monthly option
    if (scriptype == 'CE' || scriptype == 'PE') {
        let isweekly = ratify.isNumeric(scrip[1]);
        //year month firstletter date strike ce/pe 
        let weekly_format = isweekly ? `${scrip[3]}${scrip[2].slice(0, 1)}` + `0${scrip[1]}`.slice(-2) + `${scrip[4]}${scrip[5]}` : 0;
        var ex = isweekly ? weekly_format : `${scrip[2]}${scrip[1]}${scrip[3]}${scrip[4]}`;
    } else {
        var ex = `${scrip[2]}${scrip[1]}${scrip[3]}`;
    }

    return `${scrip[0]}${ex}`;
}

const insert_year = (scrip, scriptype) => {
    var _l = scrip.length;
    var _year = 20;

    if (scriptype == 'FUT') {
        if (!ratify.isNumeric(scrip[_l - 2]))
            _l = _l - 1;
    } else {
        if (!ratify.isNumeric(scrip.slice(-3, -2)))
            _l = _l - 2;
    }
    return insertToArray(scrip, _l, _year);
}