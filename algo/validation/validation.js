const ratify = require("node-ratify");

const {
    stringToJSON
} = require("../../string_udf/stringUDF");


const convertToObject = (str) => {
    if (ratify.isObject(input_str_obj)) return str;

    return stringToJSON(str);
}

exports.validateInput = (input_str_obj, type_arr = []) => {
    let inputObject = Object.assign({}, convertToObject(input_str_obj));

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
            return Promise.reject(`Invalid order type\n.It can be ${type_arr.join('/')}.`);
        }

        type = type.toUpperCase();
        if (type_arr.indexOf(type) == -1) {
            return Promise.reject(`Invalid order type\n.It can be ${type_arr.join('/')}.`);
        }
    }


    //BUY or SELL
    if (action == undefined) {
        return Promise.reject("Invalid order action. You have to say about action either BUY or SELL.");
    } else {
        action = action.toUpperCase();
        if (action == "BUY" || action == "SELL") {} else {
            return Promise.reject("Invalid order action. You have to input action either BUY or SELL.");
        }
    }

    if (qty == undefined || !ratify.isNumeric(qty) || !(qty > 0)) {
        return Promise.reject("Oops...Your input qty is wrong.");
    }

    if (price == undefined || !ratify.isNumeric(price)) {
        return Promise.reject("Oops...Price is wrong.");
    }

    if (trigger == undefined || trigger == 0) {
        trigger = 0;
    } else {
        if (!ratify.isNumeric(trigger)) {
            return Promise.reject("Oops...Trigger is wrong.");
        } else {
            if (action == 'BUY' && price < trigger) return Promise.reject("Oops...Price should be more than the trigger.");
            if (action == 'SELL' && price > trigger) return Promise.reject("Oops...Price should be less than the trigger.");
        }
    }

    if (sl == undefined || !ratify.isNumeric(sl)) {
        return Promise.reject("Oops...Stoploss is wrong.");
    }

    if (sl == undefined || !ratify.isNumeric(tgt)) {
        return Promise.reject("Oops...Target is wrong.");
    }

    if (tsl == undefined) {
        tsl = 0;
    } else {
        if (!ratify.isNumeric(tsl) || (tsl < 1)) {
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