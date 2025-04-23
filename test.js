const db = require("./utils/db");
const llm = require("./utils/llm")
const init = async ()=>
{
    // console.log(
    //     await db.getMsgByTime(Date.now()-3600*1000)
    // )
    // console.log(
    //     await llm.chat(
    //         JSON.stringify(
    //             await db.getMsgByTime(Date.now()-3600*1000)
    //         )
    //     )
    // )


    const count = await db.countMsgAndMaxId();

    console.log(count)

    const ret = await llm.chat(
        JSON.stringify(
            await db.getMsgById(count.maxId,count.maxId-5)
        )
    )

    const match = ret.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonData = JSON.parse(match[1]);
    console.log(
        jsonData
    )
}
init()