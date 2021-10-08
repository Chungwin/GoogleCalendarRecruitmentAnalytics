const getFullCalendar = require('./fullCalendar/getFullCalendar')
const dbInsertFullCalendar = require('./fullCalendar/dbInsertFullCalendar')
const getSingleEvents = require('./getSingleEvents')
const dbInsertSingleEvents = require('./dbInsertSingleEvents')

const express = require('express')
const getBreezyCandidates = require('./breezy/getBreezyCandidates')
const queryPositionIds = require('./breezy/queryPositionIds')

const app = express()
const port = 9090

app.get('/calendar', async (req, res) => {
    try {

        let fullCalendarArray = await getFullCalendar()
        dbInsertFullCalendar(fullCalendarArray)
        
        // Get events out of DB
        // let singleEventsArray = getSingleEvents(fullCalendarArray)
        // Get all non-Jimdo Email addresses / events

        // Get all breezy candidates
        // cross-check if email breezy = email Google Cal. If yes ...
        // ... Add Date, time, interviewer to BreezyStream DB

        // How many 1st interviews actually happened?
        // Did not happen: 
        //      - Recruiter or Candidate cancelled (LET ALL RECRUITERS KNOW, CANCELL IF NOT HAPPENED!)
        //   



        // await dbInsertSingleEvents(singleEventsArray)

        res.send("Done")

    } catch (e) {
        console.log(e);
    }
})


app.get('/breezy', async (req, res) => {
    try {

        let positionIds = await queryPositionIds()
        await getBreezyCandidates(positionIds)

        // Incrrect string calues in candidate names!
        // Create DB for GCal
        // Function to cross check Gcal and DB Breezy for email address. 
        // Find connections between Google Cals and Breezy DBs

        res.send('Howdy!')

      

    } catch (e) {
        console.log(e);
    }
})



app.listen(port, () => {
    console.log('Server is listening to port ' + port)
})