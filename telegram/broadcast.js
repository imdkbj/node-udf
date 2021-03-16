var Queue = require("better-queue");
const Telegraf = require("telegraf");

const stringUDFs = require("../string_udf/stringUDF");

var q = new Queue(function (task, cb) {
    Promise.all(task).catch((e) => { });
    cb(null, "done");
}, {
    afterProcessDelay: 1100
})

class BroadCastMessage extends stringUDFs {
    constructor() { }

    broadcastMessages = (BotOrToken, users, text, params, msg_per_seconds = 25, isSameParams = true, isSameMessage = true) => {
        let _this = this;
        //validate
        if (!BotOrToken) return new Error('A bot token or bot instance is required.');
        if (!Array.isArray(users)) return new Error('Argument users must be array.');
        if (msg_per_seconds > 29) return new Error('API limit is 30, Keep it 29 for safe side.');
        if (!isSameParams && params.length != users.length) return new Error('Users and params count is not equal.');
        if (!isSameParams && !Array.isArray(params)) return new Error('Argument params must be array.');
        if (!isSameMessage && text.length != users.length) return new Error('Users and text count is not equal.');
        if (!isSameMessage && !Array.isArray(text)) return new Error('Argument text must be array.');

        let _bot = _this.isObject(typeof BotOrToken === 'object' && BotOrToken !== null) ? BotOrToken :
            new Telegraf(BotOrToken).telegram;

        for (let i = 0; i < users.length; i += msg_per_seconds) {
            const requests = users.slice(i, i + msg_per_seconds).map((chatId, index) => {
                const KParams = isSameParams ? params : params[index];
                const msgToUser = isSameMessage ? text : text[index];
                return _bot
                    .sendMessage(chatId, msgToUser, KParams) // function to send the msg.
                    .catch((e) => console.log(e))
            });
            q.push(requests);
        }
    }
}


module.exports = BroadCastMessage