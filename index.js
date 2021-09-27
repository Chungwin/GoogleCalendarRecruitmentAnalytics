const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = require('./config')
const axios = require('axios')
const express = require('express')
const { google } = require('googleapis')
const { OAuth2 } = google.auth



const app = express()
const port = 9090

const oAuth2Client = new OAuth2(
    CLIENT_ID, 
    CLIENT_SECRET
)

oAuth2Client.setCredentials({
    refresh_token: `${REFRESH_TOKEN}`
})

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })


app.get('/calendar', async (req, res) => {
    try {
        var nextPageToken 
        var fullCalendarArray = []

        do {
            if (nextPageToken) {
                var response = await calendar.events.list({
                    calendarId: 'chung.huynh@jimdo.com',
                    pageToken: `${nextPageToken}`
                })
            } else {
                var response = await calendar.events.list({
                    calendarId: 'chung.huynh@jimdo.com',
                })
            }
    
            let responseCalendarPage = response.data.items
            var nextPageToken = response.data.nextPageToken
            console.log(`Next pages token ${nextPageToken}`);
            
            for (let event of responseCalendarPage) {
                let eventObject = new Object()
                eventObject.eventId = event.id
                eventObject.eventStatus = event.status
                eventObject.created = event.created
                eventObject.updated = event.updated
                eventObject.eventName = event.summary
                eventObject.description = event.description
                eventObject.creator = event.creator
                eventObject.organizer = event.organizer
                eventObject.startTime = event.start
                eventObject.endTime = event.end
                eventObject.attendees = event.attendees // Email, responsestartis, displayName
                fullCalendarArray.push(eventObject)
            }

        } while (response.data.nextPageToken)

        console.log(`Number of events: ${fullCalendarArray.length}`)
        res.send(fullCalendarArray[fullCalendarArray.length - 1])
       
    } catch (e) {
        console.log(e);
    }
})



app.listen(port, () => {
    console.log('Server is listening to port ' + port)
})