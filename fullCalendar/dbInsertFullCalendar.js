const { GOOGLE_CAL_DATABASE, CONNECTION_URL } = require('../config')
const chalk = require('chalk')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = CONNECTION_URL  // Connect to DB Server
const databaseName = GOOGLE_CAL_DATABASE  // Connect / Create DB


const dbInsertFullCalendar = async (fullCalendarArray) => {

    try {
        let counterNewEventsInserted = 0
        let counterUnchangedEvents = 0
        let counterUpdatedEvents = 0
        let counterStartUndefined = 0
        let counterDateTimeUndefined = 0

        // Check date Format and time comparisson!
        const checkDate = "2010-06-01"
        const parsedCheckDate = Date.parse(checkDate)

        
        // Get all Evets from API Call since checkDate
        let apiRecentEvents = []
        for (let event of fullCalendarArray) {
            if (event.start === undefined) {
                // Cancelled Events - originalStartTime: { .. }
                counterStartUndefined = counterStartUndefined + 1
                continue
            }

            let dateObj = event.start
            if (dateObj.dateTime === undefined) {
                // Whole Day Events e.g. Holiday
                counterDateTimeUndefined = counterDateTimeUndefined + 1
                continue
            }

            let dateString = dateObj.dateTime
            let parsedDate = Date.parse(dateString)

            if (parsedDate > parsedCheckDate) {
                apiRecentEvents.push(event)
            } 
            continue
        }
        
        console.log(`'Cancelled' events since ${checkDate}: ${counterStartUndefined}`)
        console.log(`'All day' events since ${checkDate}: ${counterDateTimeUndefined}`)
        console.log(`Other events since ${checkDate}: ${apiRecentEvents.length} \n`)
        

        // Get all Events from DB since checkDate
        const client = await MongoClient.connect(connectionURL)
        const db = client.db(databaseName)

        let dbRecentEvents = []
        let dbAllEvents = await db.collection('fullGoogleCalendar').find({}).toArray()
        for (let event of dbAllEvents) {

            let dateString = event.start.dateTime
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

        console.log(chalk.bgGreen(`Events in DB since ${checkDate}: ${dbRecentEvents.length}\n`))


        // Cross-check new, updated or unchanged events
        let dbRecentEventIds = dbRecentEvents.map(item => {return item.id})
        for(let apiEvent of apiRecentEvents) {

            if(!dbRecentEventIds.includes(apiEvent.id)) {
                let result = await db.collection('fullGoogleCalendar').insertOne(apiEvent)
                counterNewEventsInserted = counterNewEventsInserted + 1
                continue
            } 

            let dbEventMatch = dbRecentEvents.find(dbEvent => dbEvent.id === apiEvent.id )
            if (dbEventMatch.updated === apiEvent.updated) {
                counterUnchangedEvents = counterUnchangedEvents + 1
                continue
            }

            // Update DB Event
            let result = await db.collection('fullGoogleCalendar').replaceOne({"id": apiEvent.id}, apiEvent)
            counterUpdatedEvents = counterUpdatedEvents + 1
            
        }
        console.log('Cross-check DB with API Call:')
        console.log(`Newly created events since last update: ${counterNewEventsInserted}`)
        console.log(`Updated events since last update: ${counterUpdatedEvents}`)
        console.log(`Unchanged events since last update: ${counterUnchangedEvents}`)

        client.close()
    } catch(e) {
        console.log(e);
    }

}

module.exports = dbInsertFullCalendar