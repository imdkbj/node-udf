const Sqlfn = require('../dbfn/sqlUDF');

class Pushlog extends Sqlfn {
    constructor() {
        super()
    }

    //  this.sqlQuery(_sql, values, null, false, con);


    dbInfo = {
        tableName: 'x',
        channelIdHeader: 1,
        telegramIdHeader: 'telegram_id',
        channelNameHeader
    }


    channelMapping = async (ctx, matchText = 'mapAGroup', dbInfo = {}) => {
        if (ctx.updateType != 'message' || ctx.updateSubTypes[0] != 'text') return;

        let {
            tg,
            telegram,
            update: {
                message: {
                    forward_from_chat,
                    text,
                    chat,
                    from
                }
            }
        } = ctx;


        let {
            tableName,
            channelIdHeader,
            telegramIdHeader,
            channelNameHeader
        } = dbInfo

        var fwdFrom = forward_from_chat;
        var telegram_id = chat.id;


        if (fwdFrom == undefined && text == matchText) {
            fwdFrom = chat;
            telegram_id = from.id;
        }

        if (fwdFrom == undefined) return;

        let resourceid = String(fwdFrom.id);
        let title = fwdFrom.title;
        let resourceTitle = Buffer.from(title).toString('base64');
        let type = fwdFrom.type;
        //    let telegram_id = ctx.chat.id;

        const sendMsg = (txt) => telegram.sendMessage(telegram_id, txt, {
            parse_mode: "HTML"
        }).catch(e => { });

        try {
            const admins = await tg.getChatAdministrators(resourceid);
            const isAdminThere = JSON.stringify(admins).includes(telegram_id);

            if (!isAdminThere) return sendMsg(`You are not a admin in ${type} <i>${title}</i>.`);

            var sql = `select * from ${tableName} where ${telegramIdHeader}='${telegram_id}' and ${channelIdHeader} = '${resourceid}'`;
            let _status = await this.sqlProcess(sql, false);
            if (_status != 0) return sendMsg(`This ${type} mapping already exists.`);

            sql = `INSERT INTO ${tableName} (${telegramIdHeader},${channelIdHeader},${channel_name}) VALUES ?`;
            var values = [
                [telegram_id, resourceid, resourceTitle]
            ]

            let insert_id = await this.sqlProcess(sql, false, values);
            let insertId = insert_id.insertId;

            let new_mappingcode = idSeries(insertId);

            sql = `UPDATE ${tableName} SET forward_id = '${new_mappingcode}' WHERE id = '${insertId}'`;
            let _done = await this.sqlProcess(sql, false);
            let reply = _done != 0 ? `Hey! Mapping done. The Forward ID for ${type} <i>${title}</i> is <b>${new_mappingcode}</b>` : 'Something went wrong.';
            return sendMsg(reply);

        } catch (e) {
            ctx.replyWithHTML(e.description).catch(e => { })
        }
    }

}