const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, CALENDAR_EMAIL } = require('../config')
const chalk = require('chalk')
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
    var counter = 0

    do {
        if (nextPageToken) {
            var response = await calendar.events.list({
                calendarId: `${CALENDAR_EMAIL}`,
                maxResults: 500,
                // orderBy: "updated",
                pageToken: `${nextPageToken}`
            })
        } else {
            var response = await calendar.events.list({
                calendarId: `${CALENDAR_EMAIL}`,
                maxResults: 500,
                // orderBy: "updated"
            })
        }

        let responseCalendarPage = response.data.items
        
        for (let event of responseCalendarPage) {
            let eventObject = new Object()
            eventObject = event
            fullCalendarArray.push(eventObject)
        }
        counter = counter + 1
        console.log(`Page: ${counter}`)
        nextPageToken = response.data.nextPageToken

    } while (response.data.nextPageToken)

    console.log(chalk.bgGrey(`\nTotal number of fetched events: ${fullCalendarArray.length}`))
    return fullCalendarArray

}

module.exports = getFullCalendar