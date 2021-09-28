const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, CALENDAR_EMAIL } = require('./config')
const { google } = require('googleapis')
const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2(
    CLIENT_ID, 
    CLIENT_SECRET
)

oAuth2Client.setCredentials({
    refresh_token: `${REFRESH_TOKEN}`
})

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })


const getFullCalendar = async () => {
    var nextPageToken 
    var fullCalendarArray = []

    do {
        if (nextPageToken) {
            var response = await calendar.events.list({
                calendarId: `${CALENDAR_EMAIL}`,
                pageToken: `${nextPageToken}`
            })
        } else {
            var response = await calendar.events.list({
                calendarId: `${CALENDAR_EMAIL}`,
            })
        }

        let responseCalendarPage = response.data.items
        var nextPageToken = response.data.nextPageToken
        console.log(`Next pages token ${nextPageToken}`);
        
        for (let event of responseCalendarPage) {
            let eventObject = new Object()
            eventObject = event
            fullCalendarArray.push(eventObject)
        }

    } while (response.data.nextPageToken)

    console.log(`Full Calendar Array: Number of events: ${fullCalendarArray.length}`)
    return fullCalendarArray

}

module.exports = getFullCalendar