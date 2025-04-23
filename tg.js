const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const db = require("./utils/db")
bot.on('message', async(msg) => {
    try {
        // console.log(msg)
        if(msg.chat.id != process.env.LISTEN_GROUP)
        {
            return false;
        }
        const _msg = {
            id:msg.message_id,
            uid:msg.from.id,
            text:msg.text,
            timestamp:msg.date
        }
        await db.newUser(msg.from);
        await db.newMsg(_msg);
        if (msg["reply_to_message"]) {
            // console.log(msg)
        } else {
            // await router(msg)
        }
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