require('dotenv').config()
const tg = require("./tg")
const db = require("./utils/db");
const llm = require("./utils/llm")

const msgInterval = process.env.MSG_INTERVAL

let lastIndex = process.env.LAST_INDEX

async function sendSum(bot, msgData) {
    const msg = await bot.sendMessage(process.env.CHANNEL_ID, msgData, {
        parse_mode: 'MarkDown',
        disable_web_page_preview: "false",
    });
    return msg
}

async function sum() {
    const count = await db.countMsgAndMaxId();
    const msg = await db.getMsgById(count.maxId,count.maxId-(count.total - lastIndex))
    const ret = await llm.chat(
        JSON.stringify(
            msg
        )
    )
    const match = ret.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonData = JSON.parse(match[1]);
    if(jsonData)
    {
        let user = Object.keys(jsonData.users);
        let u = {}
        let final = `
🌼${jsonData.sum}

👀 Key users :
        `

        for(i in user)
            {
                let e = user[i]
                let tmp = await db.getUserById(Number(e))
                if(tmp && tmp.length>0)
                {
                    u[e]=tmp[0];
                    final+=
                    `
【[${(tmp[0]?.first_name?tmp[0]?.first_name:"") + (tmp[0]?.last_name?tmp[0]?.last_name:"")}](http://t.me/${tmp[0]?.username})】 => ⭐ ${jsonData.users[e].value}  
${jsonData.users[e].sum}

                    `
                }
            }
        final+=`
🍺 Key Messages : 
`
            jsonData.key_msg.forEach(e => {
                final+=
`
https://t.me/c/1669205706/${e}
`
            });
        return final;
    }
    
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function loop() {

    while(true)
    {
        const count = await db.countMsgAndMaxId();
        if(count.total - lastIndex >= msgInterval)
        {
            //Time to clean
            console.log("Index Now :: ",count.total)
            
            const data = await sum()
            lastIndex = count.total;
            await db.updateMonitorIndexer({
                id:0,
                index:count.total
            })
            await sendSum(
                tg.getBot(),data
            )

        }
        
        await sleep(process.env.INTERVAL)
    }
}
async function init() {
    lastIndex = (await db.getMonitorIndexer()).index
    await loop();
}

init()