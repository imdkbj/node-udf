const arrayColumn = (arr, n) => arr.map((x) => x[n]);
const rpt = (n, txt = ' ') => txt.repeat(n);
const lengths = (val, isCheckDecimals, declength) => {
    let _txt = isCheckDecimals && typeof(val) == 'number' && declength > 0 ? val.toFixed(declength) : val;
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
        let _arr = arrayColumn(arr, i).filter(r => r > 0);
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

const createTable = (isObj = true, isArrayReturn = false, hdr, array_for_table, sep = '|', isCheckDecimals = false, declength = 1) => {
    let array = isObj ? convert_obj_arr(array_for_table) : parse_copy(array_for_table);
    if (array.length == 0)
        return 'No data found.';

    //get each col length
    let col_length = JSON.parse(JSON.stringify(array));
    let total_cols = col_length[0].length;

    //negative values arr
    let col_negative = [...get_negative(col_length, total_cols)];

    //postive values arr
    let col_positive = [...get_positive(col_length, total_cols)];

    //find max each col
    if (hdr != null)
        col_length.push(hdr);
    let col_length_arr = col_length.map((r) => r.map((c) => lengths(c, isCheckDecimals, declength)));
    let col_max = [...max_string_lengths(col_length_arr, total_cols)];

    const format_row = (arrayValue, index) => {
        var rowTxt = arrayValue;
        //check decimal
        if (isCheckDecimals && typeof(rowTxt) == 'number')
            rowTxt = rowTxt.toFixed(declength);

        if (index == total_cols - 1)
            return rowTxt;

        //add_space_if_col_have_negative
        let isNegative = col_negative[index] < 0 && rowTxt >= 0;

        //add extra space if col have negative and postive length>negative
        let positive_buffer = col_negative[index] < 0 && col_max[index] >= col_negative[index].toString().length && col_positive[index].toString().length >= col_negative[index].toString().length

            var _spaces = (-isNegative + positive_buffer + col_max[index] - lengths(rowTxt, isCheckDecimals, declength)) || 0;
        _spaces = _spaces < 0 ? 0 : _spaces;
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

    let find_max_length = Math.max(...space_arr.map(r => r.length));

    //add hdr
    if (hdr != null) {
        space_arr.unshift(rpt(find_max_length, '-'));
        space_arr.unshift(map_arr(hdr));
    }

    let final_array_table = isArrayReturn ? space_arr : space_arr.join('\n');
    return final_array_table;
}

exports.arr2Table = (...arg) => createTable(...arg);
exports.arr_Table = (...arg) => {
    let t = createTable(...arg);
    let _c = Array.isArray(t) ? t.join('\n') : t;
    return {
        table: t,
        code: `<code>${_c}</code>`
    }
}
