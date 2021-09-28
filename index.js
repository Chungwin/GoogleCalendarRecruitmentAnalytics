const getFullCalendar = require('./getFullCalendar')
const getSingleEvents = require('./getSingleEvents')

const express = require('express')

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


app.listen(port, () => {
    console.log('Server is listening to port ' + port)
})