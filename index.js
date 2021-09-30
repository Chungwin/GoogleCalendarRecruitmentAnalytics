const getFullCalendar = require('./getFullCalendar')
const getSingleEvents = require('./getSingleEvents')

const express = require('express')
const getBreezyCandidates = require('./getBreezyCandidates')
const queryPositionIds = require('../breezySQL/candidates/queryPositionIds')

const app = express()
const port = 9090

app.get('/calendar', async (req, res) => {
    try {

        let fullCalendarArray = await getFullCalendar()
        let singleEventsArray = getSingleEvents(fullCalendarArray)
        res.send(singleEventsArray.slice(-50))

    } catch (e) {
        console.log(e);
    }
})


app.get('/breezy', async (req, res) => {
    try {

        let positionIds = await queryPositionIds()
        await getBreezyCandidates(positionIds)

        // Incrrect string calues in candidate names!
        // find connections between Google Cals and Breezy DBs

        res.send('Howdy!')

      

    } catch (e) {
        console.log(e);
    }
})



app.listen(port, () => {
    console.log('Server is listening to port ' + port)
})