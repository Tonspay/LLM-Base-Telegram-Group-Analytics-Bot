var MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const mainDB =process.env.SQL_DB

//Sheet name

const sUser = "user";

const sMsg = "msg";

const sSum = "summary";


async function newUser(data) {
    const pool = await MongoClient.connect(process.env.SQL_HOST);
    const db = pool.db(mainDB);
  
    const ret = await db.collection(sUser).updateOne(
      { id: data.id },
      { $set: data },
      { upsert: true }
    );
  
    await pool.close();
    return ret;
}

async function getUserById(id) {
    const pool = await MongoClient.connect(process.env.SQL_HOST)
    var db = pool.db(mainDB);
    var ret = await db.collection(sUser).find({
        id:id
    }).project({_id:0}).toArray();
    await pool.close();
    return ret;
}

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

async function countMsgAndMaxId() {
    const pool = await MongoClient.connect(process.env.SQL_HOST);
    const db = pool.db(mainDB);
  
    const collection = db.collection(sMsg);
    const totalCount = await collection.countDocuments();
    const maxIdDoc = await collection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .project({ id: 1, _id: 0 })
      .toArray();
  
    await pool.close();
  
    return {
      total: totalCount,
      maxId: maxIdDoc[0]?.id || null
    };
  }

async function getMsgById(maxId, minId) {
    const pool = await MongoClient.connect(process.env.SQL_HOST);
    const db = pool.db(mainDB);
  
    const ret = await db.collection(sMsg)
      .find({
        id: { $gt: minId, $lt: maxId }
      })
      .sort({ id: 1 })
      .project({ _id: 0 })
      .toArray();
  
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
    getMsgByTime,
    newUser,
    getUserById,
    getMsgById,
    countMsgAndMaxId
}