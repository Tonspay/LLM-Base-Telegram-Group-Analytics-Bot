var MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const mainDB =process.env.SQL_DB

//Sheet name
const sMsg = "msg";

const sSum = "summary";

async function newMsg(data) {
    const pool = await MongoClient.connect(process.env.SQL_HOST)
    var db = pool.db(mainDB);
    var ret = await db.collection(sMsg).insertOne(data);
    await pool.close();
    return ret;
}

async function getMsgByTime(time) {
    const pool = await MongoClient.connect(process.env.SQL_HOST)
    var db = pool.db(mainDB);
    var ret = await db.collection(sMsg).find({
        timestamp :{ $lt : time }
    }) .sort({ id: 1 }).project({_id:0}).toArray();
    await pool.close();
    return ret;
}

async function newSum(data) {
    const pool = await MongoClient.connect(process.env.SQL_HOST)
    var db = pool.db(mainDB);
    var ret = await db.collection(sSum).insertOne(data);
    await pool.close();
    return ret;
}

async function getSum(time) {
    const pool = await MongoClient.connect(process.env.SQL_HOST)
    var db = pool.db(mainDB);
    var ret = await db.collection(sSum).find({
        timestamp :{ $lt : time }
    }).project({}).toArray();
    await pool.close();
    return ret;
}


module.exports = {
    newMsg,
    getMsgByTime
}