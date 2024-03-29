const StringUDF = require('./stringUDF');

const arrayColumn = (arr, n) => arr.map((x) => x[n]);
const rpt = (n, txt = ' ') => txt.repeat(n);

const lengths = (val, decimalLengths) => {
    let _txt = typeof (val) == 'number' && decimalLengths > 0 ? val.toFixed(decimalLengths) : val;
    return _txt.toString().length;
}

const parse_copy = (arr) => JSON.parse(JSON.stringify(arr));

const convert_obj_arr = (obj) => {
    let _arr = parse_copy(obj);
    let arr = _arr.map(o => Object.values(o));
    return arr;
}

const get_negative = (arr, total_cols) => {
    let col_negative = [];
    for (let i = 0; i < total_cols; i++) {
        let _n = Math.min(...arrayColumn(arr, i)) || 0;
        col_negative.push(_n);
    }
    return col_negative;
}

const get_positive = (arr, total_cols) => {
    let col_positive = [];
    for (let i = 0; i < total_cols; i++) {
        let _arr = arrayColumn(arr, i).filter(r => r >= 0);
        let _n = Math.max(..._arr) || 0;
        col_positive.push(_n);
    }
    return col_positive;
}

const max_string_lengths = (arr, total_cols) => {
    let col_max = [];
    for (let i = 0; i < total_cols; i++) {
        col_max.push(Math.max(...arrayColumn(arr, i)));
    }
    return col_max;
}

class Table extends StringUDF {
    constructor() {
        super()
    }

    cb(replyError, txt) {
        if (replyError) {
            return Promise.reject(txt);
        } else {
            return 'NA';
        }
    }

    // ************************************************************************************************
    // convertToTable
    //
    //  This will convert string/object/array into a tabular format.
    //  It will have 7 arguments.

    //  convertToTable('1,2,3,4',null,false) ;//Output will be - 1|2|3|4
    //  convertToTable([[1.12,2,3,4]],null,false,false,"|",2) ;//Output will be - 1.12|2.00|3.00|4.00
    //  convertToTable('1-2-3-4',null,false,"||",0,"-") ;//Output will be - 1||2||3||4
    //  convertToTable([[1,2,3,4]],null,false) ;//Output will be - 1|2|3|4
    //  convertToTable([[1,2,3,4]],['col1','col2','col3','col4'],false,false) ;//Output will be following
    //  col1|col2|col3|col4
    //  -------------------
    //  1   |2   |3   |4
    //  convertToTable(sqlResult,['col1','col2','col3','col4']) ;//Direct sql result also can be converted.
    // ************************************************************************************************
    convertToTable = (array_for_table, hdr = null, isObj = true, isArrayReturn = false, sep = '|', decimalLengths = 0, stringSplitter = ",", bunkColumn = 0, isfixedformat = true, replyError = true) => {
        let _this = this;
        try {
            let array = isObj ? convert_obj_arr(array_for_table) : Array.isArray(array_for_table) ? parse_copy(array_for_table) : [array_for_table.split(stringSplitter)];
            if (array.length == 0) return _this.cb(replyError, 'Invalid data passed in 1st argument.')
            // return Promise.reject('Invalid data passed in 1st argument.');

            //slice column
            if (bunkColumn > 0) {
                array = this.deleteColumns(array, bunkColumn);
            }

            //get each col length
            let col_length = JSON.parse(JSON.stringify(array));

            let total_cols = col_length[0].length;
            if (col_length[0].constructor !== Array) return _this.cb(replyError, "Input is invalid for table conversion.")

            //Promise.reject("Input is invalid for table conversion.")

            //negative values arr
            let col_negative = [...get_negative(col_length, total_cols)];

            //postive values arr
            let col_positive = [...get_positive(col_length, total_cols)];

            //find max each col
            if (hdr != null) {
                if (!Array.isArray(hdr)) return _this.cb(replyError, "Header can be either null or an array");
                if (hdr.length != col_length[0].length) return _this.cb(replyError, "Header column count mismatched.");

                col_length.push(hdr);
            }

            let col_length_arr = col_length.map((r) => r.map((c) => lengths(c, decimalLengths)));
            let col_max = [...max_string_lengths(col_length_arr, total_cols)];

            const format_row = (arrayValue, index) => {
                var rowTxt = arrayValue;

                //check decimal
                if (decimalLengths > 0 && typeof (rowTxt) == 'number')
                    rowTxt = rowTxt.toFixed(decimalLengths);

                // if (index == total_cols - 1)
                //     return rowTxt;

                //add_space_if_col_have_negative
                let isNegative = col_negative[index] < 0 && rowTxt >= 0;

                //add extra space if col have negative and positive length>negative negative
                let positive_buffer = col_negative[index] < 0 && col_max[index] >= col_negative[index].toString().length && col_positive[index].toString().length >= col_negative[index].toString().length

                var _spaces = Math.max(0, ((-isNegative + positive_buffer + col_max[index] - lengths(rowTxt, decimalLengths)) || 0));
                let _txt = rowTxt + rpt(_spaces);

                let _return = isNegative ? rpt(1) + _txt : _txt;
                return _return;
            }

            //create table space
            let _space_arr = JSON.parse(JSON.stringify(array));

            let map_arr = (r) => {
                let row = r.map((rowTxt, index) => format_row(rowTxt, index));
                return row.join(sep);
            }

            let space_arr = _space_arr.map((r) => map_arr(r));

            //add header
            if (hdr != null) {
                let _hdr = map_arr(hdr);
                let find_max_length = Math.max(...space_arr.map(r => r.length), _hdr.length);

                space_arr.unshift(rpt(find_max_length, '-'));
                space_arr.unshift(_hdr);
            }

            var final_table = isArrayReturn ? space_arr : space_arr.join('\n');
            final_table = isfixedformat ? `<code>${final_table}</code>` : final_table;
            return final_table;
        } catch (e) {
            return _this.cb(replyError, e);
        }
    }
}


module.exports = Table