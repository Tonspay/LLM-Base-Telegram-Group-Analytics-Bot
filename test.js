const db = require("./utils/db");
const llm = require("./utils/llm")
const init = async ()=>
{
    // console.log(
    //     await db.getMsgByTime(Date.now()-3600*1000)
    // )
    console.log(
        await llm.chat(
            JSON.stringify(
                await db.getMsgByTime(Date.now()-3600*1000)
            )
        )
    )

}
init()