let calendarDates = []
let events = []

document.addEventListener('DOMContentLoaded', () => {
  downloadCalendarDates()
  downloadCalendarEvents()
  setWeekdaysOnCalendar()
  // make a date object for the current date
  // get the first day of the month
  // get the last day of the month
  // loop through from the first day of the month to the last
  resetCalendarAttributes()
  populateCalendarWithDays()
  setListenerOnCustomerCal()
})

function downloadCalendarDates() {
  fetch('http://localhost:3000/api/v1/calendar_dates')
  .then( response => response.json())
  .then( json => {
    json.forEach(dateJSON => {
      new CalendarDate(dateJSON)
    })
  })
}

function setListenerOnCustomerCal() {
  const cal = document.getElementById('custom-cal')
  cal.addEventListener('click', (event) => {
    if (event.target && event.target.getAttribute('date-square') === 'true') {
      console.log('found a square')
      const dateDetailContainer = document.getElementById("date-detail-container")
      dateDetailContainer.innerHTML = ''
      openDetailView(event.target)
    }
  })
}

function resetCalendarAttributes() {
  const dates = document.querySelectorAll('.date')
  dates.forEach( (date) => {
    date.removeAttribute('date-square')
  })
}

function populateCalendarWithDays() {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1) // between 0 and 6
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  let currentDate = firstDay.getDate()
  const dates = document.querySelectorAll('.date')
  let foundFirstDayOfMonth = false
  dates.forEach( (date) => {
    if (parseInt(date.getAttribute('data-weekday')) === firstDay.getDay()) {
      foundFirstDayOfMonth = true
    }

    if (foundFirstDayOfMonth && currentDate <= lastDay.getDate()) {
      const numDiv = document.createElement('div')
      numDiv.setAttribute('date-num', currentDate)
      numDiv.className = 'date-num'
      const span = document.createElement('span')
      span.innerText = currentDate
      numDiv.appendChild(span)
      date.appendChild(numDiv)
      date.setAttribute('date-square', 'true')
      currentDate += 1
    } else {
      date.setAttribute('style', 'background-color: white;')
    }
  })
}

function getWeekdayFromNumber(attributeNumber) {
  switch (attributeNumber) {
    case 0:
      return 'Sunday'
    case 1:
      return 'Monday'
    case 2:
      return 'Tuesday'
    case 3:
      return 'Wednesday'
    case 4:
      return 'Thursday'
    case 5:
      return 'Friday'
    case 6:
      return 'Saturday'
  }
}

function setWeekdaysOnCalendar() {
  const cal = document.getElementById('custom-cal')
  const dates = document.querySelectorAll('.date')
  let currentWeekday = 1
  dates.forEach( (date) => {
    if (!(currentWeekday - 7 < 1)) {
      currentWeekday -= 7
    }
    date.setAttribute('data-weekday', currentWeekday-1)
    currentWeekday += 1
  })
}

function downloadCalendarEvents() {
  fetch('http://localhost:3000/api/v1/events')
  .then( (response) => {
    return response.json()
  })
  .then( (json) => {
    console.log(json)
    // it works.
    // from here:
    // parse JSON of events (maybe use an
    // event class)
    // all dates that events with the ones we pulled down from the server.
    createLocalEvents(json)
  })
}

function createLocalEvents(eventJSONCollection) {
  eventJSONCollection.forEach( (eventJSON) => {
    new Event(eventJSON)
  })
}

function setDateListeners() {
  const table = document.querySelector('table')
  table.addEventListener('click', (event) => {
    if (event.target && event.target.tagName === 'TD') {
      const div = document.getElementById('date-detail-container')
      div.innerHTML = ``
      openDetailView(event.target)
    }
  })
}

function openDetailView(tdElement) {
  const div = document.getElementById('date-detail-container')
  div.appendChild(document.createElement('hr'))
  const detailHTML = makeDetailViewHTML()
  div.appendChild(detailHTML)
}

function makeDetailViewHTML() {
  const div = document.createElement('div')
  const list = document.createElement('ul')

  const newTaskBtn = document.createElement('button')
  newTaskBtn.innerText = 'New Event'
  setNewListener(div, newTaskBtn)

  const backButton = document.createElement('button')
  backButton.innerText = 'Cancel'
  backButton.addEventListener('click', (e) => {
    document.getElementById('date-detail-container').innerHTML = ''
  })

  div.appendChild(list)
  div.appendChild(newTaskBtn)
  div.appendChild(document.createElement('br'))
  div.appendChild(backButton)

  return div
}

function setNewListener(div, newTaskBtn) {
  const list = document.createElement('ul')

  newTaskBtn.addEventListener('click', (e) => {
    const form = document.createElement('form')
    const title = document.createElement('input')
    title.setAttribute('placeholder', 'Title...')
    const location = document.createElement('input')
    location.setAttribute('placeholder', 'Location...')
    const startDate = document.createElement('input')
    startDate.setAttribute('type', 'datetime-local')
    const endDate = document.createElement('input')
    endDate.setAttribute('type', 'datetime-local')
    const submitButton = document.createElement('input')
    submitButton.setAttribute("type", "submit")
    form.appendChild(title)
    form.appendChild(document.createElement('br'))
    form.appendChild(location)
    form.appendChild(document.createElement('br'))
    form.appendChild(startDate)
    form.appendChild(document.createElement('br'))
    form.appendChild(endDate)
    form.appendChild(document.createElement('br'))
    startDate.value = new Date()
    form.appendChild(submitButton)
    div.appendChild(form)

    form.addEventListener('submit', (e) => {
      event.preventDefault()
      fetch('http://localhost:3000/api/v1/events', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: title.value,
          location: location.value,
          start_date: startDate.value,
          end_date: endDate.value
        })
      })
      .then(res => res.json())
      .then(json => {console.log(json)})
      .then(function() {let listItem = document.createElement("li")
          listItem.innerHTML = title.value
          div.appendChild(listItem)
        })
    })
  })
}

class CalendarDate {
  constructor(dateJSON) {
    this.id = dateJSON.id
    this.date = new Date(dateJSON.date)
    calendarDates.push(this)
  }

  static findById(id) {
    return calendarDates.filter( (calDate) => {
      return calDate.id === id
    })[0]
  }
}

class Event {
  constructor(eventJSON) {
    this.id = eventJSON.id
    this.title = eventJSON.title
    this.location = eventJSON.location
    this.startDate = CalendarDate.findById(eventJSON.calendar_date_id)
    this.endDate = new Date(eventJSON.end_date)
    events.push(this)
  }
}
