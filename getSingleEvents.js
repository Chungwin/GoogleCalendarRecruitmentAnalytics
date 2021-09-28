
const getSingleEvents = (fullCalendarArray) => {

    var singleEventsArray = []

    for (let event of fullCalendarArray) {

        if (event.recurrence || event.recurringEventId) {
            continue
        }

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
        eventObject.attendees = event.attendees // Email, responsestartis, displayName (not everywhere)
        singleEventsArray.push(eventObject)
    }
    console.log(`Single Events - Number of events: ${singleEventsArray.length}`)
    return singleEventsArray
}

module.exports = getSingleEvents