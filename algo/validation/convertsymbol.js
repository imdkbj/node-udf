const StringUDF = require("../../string_udf/stringUDF");

class ConvertToSymbol extends StringUDF {
    constructor() {
        super()
    }

    insertYear = (scrip, scripType) => {
        var _year = 21;

        let year_index = scripType == 'FUT' ? -2 : -3;
        let oldYear = scrip.slice(year_index, year_index + 1)[0]
        let is_year = this.isNumeric(oldYear);

        if (is_year) return scrip;

        return this.insertInToArray(scrip, year_index + 1, _year);
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
    // convertToTradingSymbol('CRUDEOIL OCT 21 FUT'); //Output will be - CRUDEOIL21OCTFUT

    // ************************************************************************************************

    convertToTradingSymbol = (stringSymbol) => {
        const months = ['M', "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        let scrip = stringSymbol.toUpperCase().split(' ');

        //find fut/ce/pe
        let scripType = scrip[scrip.length - 1];
        let isFO = scripType == 'CE' || scripType == 'PE' || scripType == 'FUT';
        if (!isFO) return stringSymbol;
        var ex;
        //insert year in ce/pe
        scrip = this.insertYear(scrip, scripType);

        //convert month as per weekly/monthly option
        if (scripType == 'CE' || scripType == 'PE') {

            //is weekly
            if (this.isNumeric(scrip[1])) {
                //YEAR MONTHINDEX DATE STRIKE CE/PE
                //2021 1 07 14000 CE
                var monthIndex = months.findIndex(element => element === scrip[2]);
                ex = `${scrip[3]}${Number(monthIndex)}` + `0${scrip[1]}`.slice(-2) + `${Number(scrip[4])}${scrip[5]}`;
            } else {
                ex = `${scrip[2]}${scrip[1]}${Number(scrip[3])}${scrip[4]}`;
            }
        } else {
            ex = `${scrip[2]}${scrip[1]}FUT`;
        }

        return `${scrip[0]}${ex}`;
    }

}


module.exports = ConvertToSymbol