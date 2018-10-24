let calendarDates = []
let events = []

let calDate = new Date()

document.addEventListener('DOMContentLoaded', () => {
  downloadCalendarDates()
  downloadCalendarEvents()
  setWeekdaysOnCalendar()
  initCalendar()
  setListenerOnCustomCal()
  setListenerOnMonthBtns()
})

function setListenerOnMonthBtns() {
  const prevMonthBtn = document.getElementById('prev-month')
  const nextMonthBtn = document.getElementById('next-month')

  prevMonthBtn.addEventListener('click', (e) => {
    calDate.setMonth(calDate.getMonth() - 1)
    initCalendar()
  })

  nextMonthBtn.addEventListener('click', (e) => {
    calDate.setMonth(calDate.getMonth() + 1)
    initCalendar()
  })
}

function initCalendar() {
  document.getElementById('month-label').innerText = `${getMonthByNum(calDate.getMonth())}, ${calDate.getFullYear()}`
  const cal = document.getElementById('custom-cal')
  cal.className = getMonthByNum(calDate.getMonth())
  removeDateNums()
  resetCalendarAttributes()
  populateCalendarWithDays()
}

function removeDateNums() {
  const dateNums = document.querySelectorAll('.date-num')
  dateNums.forEach( (dateNum) => {
    dateNum.remove()
  })
}

function downloadCalendarDates() {
  fetch('http://localhost:3000/api/v1/calendar_dates')
  .then( response => response.json())
  .then( json => {
    json.forEach(dateJSON => {
      new CalendarDate(dateJSON)
    })
  })
}

function clearClickedFromDates() {
  const dates = document.querySelectorAll('.in-month')
  dates.forEach( (date) => {
    date.className = 'col date in-month'
  })
}

function setListenerOnCustomCal() {
  const cal = document.getElementById('custom-cal')
  cal.addEventListener('click', (event) => {
    if (event.target && event.target.getAttribute('date-square') === 'true') {
      clearClickedFromDates()
      event.target.className += ' clicked'
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
    date.className = 'col date'
  })
}

function populateCalendarWithDays() {
  const firstDay = new Date(calDate.getFullYear(), calDate.getMonth(), 1) // between 0 and 6
  const lastDay = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0)
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
      date.className = 'col date in-month'
      date.appendChild(numDiv)
      date.setAttribute('date-square', 'true')
      currentDate += 1
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

function getMonthByNum(monthNum) {
  switch (monthNum) {
    case 0:
      return 'January'
    case 1:
      return 'February'
    case 2:
      return 'March'
    case 3:
      return 'April'
    case 4:
      return 'May'
    case 5:
      return 'June'
    case 6:
      return 'July'
    case 7:
      return 'August'
    case 8:
      return 'September'
    case 9:
      return 'October'
    case 10:
      return 'November'
    case 11:
      return 'December'
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

function openDetailView(target) {
  const div = document.getElementById('date-detail-container')

  // const bottomDiv = document.getElementById('new-div')

  const detailHTML = makeDetailViewHTML(target)
  div.appendChild(detailHTML)
  div.appendChild(document.createElement('hr'))
}

function makeDetailViewHTML(target) {
  const div = document.createElement('div')
  const list = document.createElement('ul')

  const newTaskBtn = document.createElement('button')
  newTaskBtn.innerText = 'New Event'
  setNewListener(div, newTaskBtn, target)

  // const backButton = document.createElement('button')
  // backButton.innerText = 'Cancel'
  // backButton.addEventListener('click', (e) => {
  //   document.getElementById('new-div').innerHTML = ''
  // })
  div.appendChild(list)
  div.appendChild(newTaskBtn)
  div.appendChild(document.createElement('br'))

  // div.appendChild(backButton)

  return div
}

function setNewListener(div, newTaskBtn, target) {
  const list = document.createElement('ul')

  const date = target.querySelector('span').innerText

  newTaskBtn.addEventListener('click', (e) => {
    div.innerHTML = ``
    const form = document.createElement('form')
    form.setAttribute('date', date)
    form.setAttribute('month', calDate.getMonth())
    form.setAttribute('year', calDate.getFullYear())
    const title = document.createElement('input')
    title.setAttribute('placeholder', 'Title...')
    const location = document.createElement('input')
    location.setAttribute('placeholder', 'Location...')
    const startDate = document.createElement('input')
    startDate.setAttribute('type', 'date')
    const endDate = document.createElement('input')
    endDate.setAttribute('type', 'date')
    const calendarDateInput = document.createElement('input')
    calendarDateInput.setAttribute('placeholder', 'calendar_date_id')
    const submitButton = document.createElement('input')
    submitButton.setAttribute("type", "submit")


    const backButton = document.createElement('button')
    backButton.innerText = 'Cancel'
    backButton.addEventListener('click', (e) => {
      document.getElementById('new-div').innerHTML = ''
    })


    form.appendChild(title)
    form.appendChild(document.createElement('br'))
    form.appendChild(location)
    form.appendChild(document.createElement('br'))
    form.appendChild(startDate)
    form.appendChild(document.createElement('br'))
    form.appendChild(endDate)
    form.appendChild(document.createElement('br'))
    form.appendChild(calendarDateInput)
    form.appendChild(document.createElement('br'))
    startDate.value = new Date()
    form.appendChild(submitButton)
    form.appendChild(backButton)
    div.appendChild(form)

    form.addEventListener('submit', (e) => {
      event.preventDefault()
      fetch('http://localhost:3000/api/v1/calendar_dates/', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: title.value,
          location: location.value,
          start_date: startDate.value,
          end_date: endDate.value,
          calendar_date_id: calendarDateInput.value
        })
      })
      .then(res => res.json())
      .then(json => {console.log(json)})
      .then(function() {
          let listItem = document.createElement("li")
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
