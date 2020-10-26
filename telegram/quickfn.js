//const Markup = require("telegraf/markup");

class Quickfn {
    constructor() {}

    cancelTask = async ({
        session,
        scene,
        replyWithHTML
    }, isSendMsg = false) => {
        //        if (isSendMsg) replyWithHTML("Hey! Cancelled the any active task.", Markup.removeKeyboard().extra());

        if (isSendMsg) replyWithHTML("Hey! Cancelled the any active task.", {
            remove_keyboard: false
        });

        session.state = null;
        return scene.leave();
    }

    sendChatAction = ({
        chat: {
            id
        },
        telegram: {
            sendChatAction
        }
    }, action) => sendChatAction(id, action);

    parseBOTToken = (tokenMsg) => tokenMsg.match(/\d{6,11}:.+/g) || 0;
}

module.exports = Quickfn;