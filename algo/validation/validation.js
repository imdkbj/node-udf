const StringUDF = require("../../string_udf/stringUDF");

class InputValidation extends StringUDF {
    constructor() {
        super()
    }

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
    validateOrderInput = (input_str_obj, type_arr = [],ignoreCheck=[]) => {

        const notIgnoreMe = (txt) => !(ignoreCheck.length == 0 ? true : ignoreCheck.indexOf(txt) > -1);

        let inputObject = this.isObject(input_str_obj) ? input_str_obj : this.stringToJSON(input_str_obj);
        Object.assign({}, input_str_obj);

        var {
            symbol,
            action,
            type,
            price,
            trigger,
            qty,
            sl,
            tgt,
            tsl,
            exchange,
            comment
        } = inputObject;

        if (type_arr.length > 0) {

            if (type == undefined) {
                return Promise.reject(`Invalid order type.\nIt can be ${type_arr.join('/')}.`);
            }

            type = type.toUpperCase();
            if (type_arr.indexOf(type) == -1) {
                return Promise.reject(`Invalid order type.\nIt can be ${type_arr.join('/')}.`);
            }
        }


        //BUY or SELL
        if (action == undefined) {
            return Promise.reject("Invalid order action.\nYou have to say about action either BUY or SELL.");
        } else {
            action = action.toUpperCase();
            if (action == "BUY" || action == "SELL") {} else {
                return Promise.reject("Invalid order action.\nYou have to input action either BUY or SELL.");
            }
        }

        if (qty == undefined || !this.isNumeric(qty) || !(qty > 0) || notIgnoreMe('qty')) {
            return Promise.reject("Oops...Your input qty is wrong.");
        }

        if (price == undefined || !this.isNumeric(price) || notIgnoreMe('price')) {
            return Promise.reject("Oops...Price is wrong.");
        }

        if (trigger == undefined || trigger == 0) {
            trigger = 0;
        } else {
            if (!this.isNumeric(trigger)) {
                return Promise.reject("Oops...Trigger is wrong.");
            } else {
                if (action == 'BUY' && price < trigger) return Promise.reject("Oops...Price should be more than the trigger.");
                if (action == 'SELL' && price > trigger) return Promise.reject("Oops...Price should be less than the trigger.");
            }
        }

        if (sl == undefined || !this.isNumeric(sl) || notIgnoreMe('sl')) {
            return Promise.reject("Oops...Stoploss is wrong.");
        }

        if (tgt == undefined || !this.isNumeric(tgt) || notIgnoreMe('tgt')) {
            return Promise.reject("Oops...Target is wrong.");
        }

        if (tsl == undefined || tsl == 0) {
            tsl = 0;
        } else {
            if (!this.isNumeric(tsl) || (tsl < 1)) {
                return Promise.reject("Oops...TSL is wrong.");
            }
        }

        comment = comment == undefined || comment == 0 ? null : comment;

        let final_Object = {
            symbol,
            action,
            price: price,
            trigger: +trigger,
            qty: +qty,
            sl: +sl,
            tgt: +tgt,
            tsl: +tsl,
            exchange: exchange == 'BSE' ? 'BSE' : 'NSE',
            comment
        };

        if (type_arr.length > 0 && type != undefined) Object.assign(final_Object, {
            type
        });

        return final_Object;
    }
}


module.exports = InputValidation