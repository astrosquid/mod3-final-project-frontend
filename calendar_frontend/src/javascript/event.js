let events = []

class Event {
  constructor(eventJSON) {
    this.id = eventJSON.id
    this.title = eventJSON.title
    this.location = eventJSON.location
    this.calendarDateId = eventJSON.calendar_date_id
    this.calendarDate = CalendarDate.findById(this.calendarDateId)
    events.push(this)
    return this
  }

  static getEventsByCalDate(calDate) {
    return events.filter( (event) => {

      return event.calendarDateId === calDate.id
    })
  }
}
