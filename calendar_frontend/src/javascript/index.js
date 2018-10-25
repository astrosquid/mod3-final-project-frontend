let calDate = new Date()

document.addEventListener('DOMContentLoaded', () => {
  const calDateAdapter = new Adapter('http://localhost:3000/api/v1/calendar_dates')
  calDateAdapter.get()
    .then( response => response.json())
    .then( json => json.forEach(dateJSON => new CalendarDate(dateJSON) ) )

  const eventsAdapter = new Adapter('http://localhost:3000/api/v1/events')
  eventsAdapter.get()
    .then( response => response.json())
    .then( json => json.forEach(eventJSON => new Event(eventJSON)))

  CalendarHandler.setWeekdaysOnCalendar()
  CalendarHandler.initCalendar()
  setListenerOnCustomCal(calDateAdapter)
  setListenerOnMonthBtns()
})

function getDateFromElement(target) {
  const day = parseInt(target.querySelector('span').innerText)
  const month = calDate.getMonth()
  const year = calDate.getFullYear()
  const date = new Date(year, month, day)
  return CalendarDate.findByDate(date)
}

function makeCardsFromCalDate(calendarDate) {
  const dateEvents = Event.getEventsByCalDate(calendarDate)
  // go make HTML cards for these events.
  const cards = makeEventCards(dateEvents)
  const div = document.getElementById('date-detail-container')
  // debugger
  cards.forEach( (card) => {
    div.appendChild(card)
  })
}
