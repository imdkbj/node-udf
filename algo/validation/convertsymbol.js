const StringUDF = require("../../string_udf/stringUDF");

class ConvertToSymbol extends StringUDF {
    constructor() {
        super()
    }

    insertYear = (scrip, scriptype) => {
        var _l = scrip.length;
        var _year = 20;

        if (scriptype == 'FUT') {
            if (!this.isNumeric(scrip[_l - 2]))
                _l = _l - 1;
        } else {
            if (!this.isNumeric(scrip.slice(-3, -2)))
                _l = _l - 2;
        }
        return this.insertInToArray(scrip, _l, _year);
    }


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

    convertToTradingSymbol = (stringSymbol) => {
        let scrip = stringSymbol.toUpperCase().split(' ');

        //find fut/ce/pe
        let scriptype = scrip[scrip.length - 1];
        let isFO = scriptype == 'CE' || scriptype == 'PE' || scriptype == 'FUT';
        if (!isFO) return stringSymbol;

        //insert year in ce/pe
        scrip = this.insertYear(scrip, scriptype);

        //convert month as per weekly/monthly option
        if (scriptype == 'CE' || scriptype == 'PE') {
            let isweekly = this.isNumeric(scrip[1]);
            //year month firstletter date strike ce/pe 
            let weekly_format = isweekly ? `${scrip[3]}${scrip[2].slice(0, 1)}` + `0${scrip[1]}`.slice(-2) + `${scrip[4]}${scrip[5]}` : 0;
            var ex = isweekly ? weekly_format : `${scrip[2]}${scrip[1]}${scrip[3]}${scrip[4]}`;
        } else {
            var ex = `${scrip[2]}${scrip[1]}${scrip[3]}`;
        }

        return `${scrip[0]}${ex}`;
    }

}

module.exports = ConvertToSymbol