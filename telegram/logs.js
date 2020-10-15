const Sqlfn = require('../dbfn/sqlUDF');

class Pushlog extends Sqlfn {
    constructor() {
        super()
    }

    __pushLogSQL = (ctx) => {
        if (ctx.updateType == "channel_post" || ctx.updateSubTypes.length == 0)
            return 0;

        let {
            updateType,
            tg: {
                token
            }
        } = ctx;

        var _input = "notext";

        var update = ctx['update'][updateType];
        update = updateType == 'message' ? update : updateType == 'callback_query' ? update['message'] : "";
        _input = updateType == 'message' ? update.text ? update.text : _input : updateType == 'callback_query' ? update['data'] : "";
        if (update = "" || _input == "") return 0;

        let {
            chat: {
                id,
                first_name,
                last_name,
                username
            }
        } = update;

        var values = [
            [
                id || 0,
                Buffer.from(first_name || " ").toString("base64"),
                Buffer.from(last_name || " ").toString("base64"),
                username || " ",
                Buffer.from(_input).toString("base64"),
                token.split(':')[0],
            ]
        ];
        //expected sql query;
        //let sql = `INSERT INTO ${dbtable} (telegram_id, first_name, last_name, user_name, user_input, from_bot) VALUES ?`;

        return values;
    }

    pushLog = (ctx, next, sql = null, dbtable = null, con) => {
        // if (sql == null && dbtable == null) return new Error('sql statement && dbtable can\'t be null');

        let _dbtable = dbtable == null ? 'all_logs' : dbtable;
        let _sql = sql != null ? sql : `INSERT INTO ${_dbtable} (telegram_id, first_name, last_name, user_name, user_input, from_bot) VALUES ?`;

        let values = __pushLogSQL(ctx);

        this.sqlQuery(_sql, values, null, false, con);
        return next();
    }
}


module.exports = Pushlog;