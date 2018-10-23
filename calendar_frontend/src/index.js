let events = []

document.addEventListener('DOMContentLoaded', () => {
  let element = document.getElementById("my-calendar");
  jsCalendar.new(element);
  setDateListeners()
  downloadCalendarEvents()
  setWeekdaysOnCalendar()
})

function setWeekdaysOnCalendar() {
  const cal = document.getElementById('custom-cal')
  const dates = document.querySelectorAll('.date')
  let currentWeekday = 1
  dates.forEach( (date) => {
    debugger
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
    events.push(new Event(eventJSON))
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
  const item1 = document.createElement('li')
  item1.innerText = 'Project'

  const item2 = document.createElement('li')
  item2.innerText = 'TO DO'

  list.appendChild(item1)
  list.appendChild(item2)

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
  newTaskBtn.addEventListener('click', (e) => {
    const form = document.createElement('form')
    const title = document.createElement('input')
    title.setAttribute('placeholder', 'Title...')
    const location = document.createElement('input')
    location.setAttribute('placeholder', 'Location...')
    const startDate = document.createElement('input')
    startDate.setAttribute('type', 'date')
    const endDate = document.createElement('input')
    endDate.setAttribute('type', 'date')
    form.appendChild(title)
    form.appendChild(document.createElement('br'))
    form.appendChild(location)
    form.appendChild(document.createElement('br'))
    form.appendChild(startDate)
    form.appendChild(document.createElement('br'))
    form.appendChild(endDate)
    form.appendChild(document.createElement('br'))
    startDate.value = new Date()
    div.appendChild(form)
  })
}


class Event {
  constructor(eventJSON) {
    this.id = eventJSON.id
    this.title = eventJSON.title
    this.location = eventJSON.location
    this.startDate = new Date(eventJSON.start_date)
    this.endDate = new Date(eventJSON.end_date)
  }
}
