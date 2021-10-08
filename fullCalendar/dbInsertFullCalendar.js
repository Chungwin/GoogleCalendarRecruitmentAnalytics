const { GOOGLE_CAL_DATABASE, CONNECTION_URL } = require('../config')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = CONNECTION_URL  // Connect to DB Server
const databaseName = GOOGLE_CAL_DATABASE  // Connect / Create DB


const dbInsertFullCalendar = async (fullCalendarArray) => {

    try {

        let counterNewEventsInserted = 0
        let counterUnchangedEvents = 0
        let counterUpdatedEvents = 0

        const checkDate = "2021-06-01"
        const parsedCheckDate = Date.parse(checkDate)

    
        const client = await MongoClient.connect(connectionURL)
        const db = client.db(databaseName)


        // Get all Events from DB since checkDate
        let dbRecentEvents = []
        let dbAllEvents = await db.collection('fullGoogleCalendar').find({}).toArray()
        for (let event of dbAllEvents) {

            if (event.start === undefined) {
                continue
            }

            var dateObj = event.start
            if (dateObj.dateTime === undefined) {
                continue
            }

            let dateString = dateObj.dateTime
            let parsedDate = Date.parse(dateString)

            if (parsedDate > parsedCheckDate) {
                let dbRecentEventObj = new Object()
                dbRecentEventObj.id = event.id
                dbRecentEventObj.created = event.created
                dbRecentEventObj.updated = event.updated
                dbRecentEvents.push(dbRecentEventObj)
            } 
            continue

        }
        console.log(`Events in DB since ${checkDate}: ${dbRecentEvents.length}`)

        
        // Get all Evets from API Call since checkDate
        let apiRecentEvents = []
        for (let event of fullCalendarArray) {
            if (event.start === undefined) {
                continue
            }

            var dateObj = event.start
            if (dateObj.dateTime === undefined) {
                continue
            }

            let dateString = dateObj.dateTime
            let parsedDate = Date.parse(dateString)

            if (parsedDate > parsedCheckDate) {
                let apiRecentEventObj = new Object()
                apiRecentEventObj.id = event.id
                apiRecentEventObj.created = event.created
                apiRecentEventObj.updated = event.updated
                apiRecentEvents.push(apiRecentEventObj)
            } 
            continue
        }
        console.log(`Events in API call since ${checkDate}: ${apiRecentEvents.length} \n`)


        // Cross-check new, updated or unchanged events
        let dbRecentEventIds = dbRecentEvents.map(item => {return item.id})
        for(let apiEvent of apiRecentEvents) {

            if(!dbRecentEventIds.includes(apiEvent.id)) {
                counterNewEventsInserted = counterNewEventsInserted + 1
                continue
            } 

            let dbEventMatch = dbRecentEvents.find(dbEvent => {
                return dbEvent.id === apiEvent.id
            })

            if (dbEventMatch === undefined || apiEvent === undefined) {
                console.log(dbEventMatch);
                console.log(apiEvent);
            }

            if (dbEventMatch.updated === apiEvent.updated) {
                counterUnchangedEvents = counterUnchangedEvents + 1
                continue
            }

            counterUpdatedEvents = counterUpdatedEvents + 1
            
        }
        console.log(`Cross-check / Unchanged Events since ${checkDate}: ${counterUnchangedEvents}`)
        console.log(`Cross-check / Updated Events since ${checkDate}: ${counterUpdatedEvents}`)
        console.log(`Cross-check / New Events since last update: ${counterNewEventsInserted}`)

        client.close()
    } catch(e) {
        console.log(e);
    }

}

module.exports = dbInsertFullCalendar