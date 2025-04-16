const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async(msg) => {
    try {
        console.log(msg)
        if (msg["reply_to_message"]) {
            // console.log(msg)
        } else {
            // await router(msg)
        }
    } catch (e) {
        console.log(e);
    }

});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    console.log(msg)
    try {

    } catch (e) {
        console.log(e);
    }

});


async function init() {

}

function getBot() {
    return bot;
}

module.exports = {
    init,
    getBot
}