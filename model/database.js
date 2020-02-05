"use strict"
const conn_string = "mongodb+srv://devbrat:beproject-2020@railrush-7bs1k.mongodb.net/test?retryWrites=true&w=majority"
    , dbName = "Railrush"
    , MongoClient = require('mongodb').MongoClient 
    , client = new MongoClient(conn_string , { useUnifiedTopology: true });


let db = null

const connect = async ()=>{
    try{
        await client.connect()
        db = client.db(dbName)
        console.log("Connected to database")
        //db.collection("trains").insertOne({trainNo:1 , start:"virar" , dest:"churchgate" , crowdInfo:{ lastStation:"" , crowdCount:0 , timestamp:0}})
    }catch(e){
        console.log(e)
    }
}

connect();

module.exports = {
    updateCrowdInfo: async (trainNo , crowdInfo)=>{
        return await db.collection("trains").updateOne({trainNo : ""+trainNo} , {$set : {crowdInfo:{
            crowdCount : crowdInfo.crowdCount,
            lastStation: crowdInfo.current,
            timestamp: crowdInfo.timestamp
        }}})
    },
    getCrowdCount: async(trainNo)=>{
        try {
            let train = await db.collection("trains").findOne({trainNo : ""+trainNo})
            if(train)
                return Object(train).crowdInfo.crowdCount
            else 
                throw new Error("train doesn't exist") 
        } catch (error) {
            console.log("database"+error)
            throw new Error("train doesn't exist") 
        }
    }
}