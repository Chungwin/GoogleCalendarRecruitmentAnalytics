const { GOOGLE_CAL_DATABASE, CONNECTION_URL } = require('./config')

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = CONNECTION_URL  // Connect to DB Server
const databaseName = GOOGLE_CAL_DATABASE   // Connect / Create DB

const dbInsertSingleEvents = async (singleEventsArray) => {

    try {
        const client = await MongoClient.connect(connectionURL)
        const db = client.db(databaseName)
        
        let fiftyEvents = singleEventsArray.slice(-50)


        let result = await db.collection('testCollection').insertMany(fiftyEvents)
        // console.log(result);

        // for(i = 0; i<2; i++) {
        //     let eventId = singleEventsArray[i].eventId
        //     let eventName = singleEventsArray[i].eventName
        //     console.log(eventId, eventName);
        // }

        client.close()


    } catch (e) {
        console.log(e);
    }

}

module.exports = dbInsertSingleEvents