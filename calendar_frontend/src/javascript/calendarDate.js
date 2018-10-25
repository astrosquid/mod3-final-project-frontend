let calendarDates = []

class CalendarDate {
  constructor(dateJSON) {
    this.id = dateJSON.id
    const splitDate = dateJSON.date.split('-')
    const year = splitDate[0]
    const date = splitDate[2]
    const month = parseInt(splitDate[1]) - 1
    this.date = new Date(year, month, date)
    calendarDates.push(this)
    return this
  }

  static findById(id) {
    return calendarDates.filter( (calDate) => {
      return calDate.id === id
    })[0]
  }

  static findByDate(date) {
    return calendarDates.filter( (calDate) => {

      if (calDate.date.getFullYear() === date.getFullYear() &&
        calDate.date.getMonth() === date.getMonth() &&
        calDate.date.getDate() === date.getDate()) {
          return calDate
        }
    })[0]
  }

  getEvents() {
    return events.filter( (event) => {
      return event.calendarDateId === this.id
    })
  }
}
