var Queue = require("better-queue");

var q = new Queue(function (task, cb) {
    Promise.all(task).catch((e) => {});
    cb(null, "done");
}, {
    afterProcessDelay: 1100
})

class BroadCastMessage {
    constructor() {}

    broadcastMessages = (
        bot,
        users,
        text,
        params,
        msg_per_seconds = 25,
        isSameParams = true,
        isSameMessge = true
    ) => {
        //validate
        if (!Array.isArray(users)) return new Error('Argument users must be array.');
        if (msg_per_seconds > 29) return new Error('API limit is 30, Keep it 29 for safe side.');
        if (!isSameParams && params.length != users.length) return new Error('Users and params count is not equal.');
        if (!isSameParams && !Array.isArray(params)) return new Error('Argument params must be array.');
        if (!isSameMessge && text.length != users.length) return new Error('Users and text count is not equal.');
        if (!isSameMessge && !Array.isArray(text)) return new Error('Argument text must be array.');


        for (let i = 0; i < users.length; i += msg_per_seconds) {
            const requests = users.slice(i, i + msg_per_seconds).map((chatId, index) => {
                const Kparams = isSameParams ? params : params[index];
                const msgTouser = isSameMessge ? text : text[index];
                return bot
                    .sendMessage(chatId, msgTouser, Kparams) // function to send the msg.
                    .catch((e) => {})
            });
            q.push(requests);
        }
    }
}


module.exports = BroadCastMessage