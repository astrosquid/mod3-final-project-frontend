document.addEventListener('DOMContentLoaded', () => {
  const calDateAdapter = new Adapter('http://localhost:3000/api/v1/calendar_dates')
  calDateAdapter.get()
    .then( response => response.json())
    .then( json => {
      json.forEach(dateJSON => new CalendarDate(dateJSON) )
      const eventsAdapter = new Adapter('http://localhost:3000/api/v1/events')
      eventsAdapter.get()
        .then( response => response.json())
        .then( json => {
          json.forEach(eventJSON => new Event(eventJSON))
          const dom = new DOMController()

          CalendarHandler.setWeekdaysOnCalendar()
          CalendarHandler.initCalendar()
          setListenerOnCustomCal(calDateAdapter)
          setListenerOnMonthBtns()
        })
    })


})
