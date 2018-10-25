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

  setWeekdaysOnCalendar()
  CalendarHandler.initCalendar()
  setListenerOnCustomCal(calDateAdapter)
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

function clearClickedFromDates() {
  const dates = document.querySelectorAll('.in-month')
  dates.forEach( (date) => {
    date.className = 'col date in-month'
  })
}

function setListenerOnCustomCal(calDateAdapter) {
  const cal = document.getElementById('custom-cal')
  cal.addEventListener('click', (event) => {
    if (event.target && event.target.getAttribute('date-square') === 'true') {
      clearClickedFromDates()
      event.target.className += ' clicked'
      const calendarDate = getDateFromElement(event.target)

      // shrink calendar if there are events on this date
      if (calendarDate && calendarDate.getEvents().length > 0) {
        cal.classList.add('shrunk')
      }

      const dateDetailContainer = document.getElementById("date-detail-container")
      dateDetailContainer.innerHTML = ''
      openDetailView(event.target, calDateAdapter)
    }
  })
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

function openDetailView(target, calDateAdapter) {
  // make 'new event' button
  // make the button apart of the flex container
  const detail = document.getElementById('date-detail-container')
  makeDetailCloseBtn(detail, target)
  const date = getDateFromElement(target)
  return
  const detailHTML = makeDetailViewHTML(target)
  detail.appendChild(detailHTML)
}

function makeDetailCloseBtn(element, dateSquare) {
  const closeBtn = document.createElement('div')
  closeBtn.classList.add('detail-item')
  closeBtn.id = 'close-btn'
  closeBtn.innerText = '[Close]'
  closeBtn.addEventListener('click', (event) => {
    closeDetailView()
    dateSquare.classList.remove('clicked') // stop blinking on cal
  })
  element.appendChild(closeBtn)
}

function closeDetailView() {
  const detail = document.getElementById('date-detail-container')
  detail.innerHTML = ''
  const cal = document.getElementById('custom-cal')
  cal.classList.remove('shrunk')
}

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

function makeEventCards(events) {
  return events.map( (event) => {
    const card = document.createElement('div')
    card.className = 'event-card'
    const title = document.createElement('p')
    const strong = document.createElement('strong')
    strong.innerText = event.title
    title.appendChild(strong)
    card.appendChild(title)
    const location = document.createElement('p')
    location.innerText = event.location
    card.appendChild(location)
    return card
  })
}

function makeDetailViewHTML(target, calDateAdapter) {
  const div = document.createElement('div')
  const list = document.createElement('ul')

  const newTaskBtn = document.createElement('button')
  newTaskBtn.innerText = 'New Event'
  setNewListener(div, newTaskBtn, target, calDateAdapter)

  div.appendChild(list)
  div.appendChild(newTaskBtn)
  div.appendChild(document.createElement('br'))

  return div
}

function setNewListener(div, newTaskBtn, target, calDateAdapter) {
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
      document.getElementById('date-detail-container').innerHTML = ''
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

    const body = {
      title: title.value,
      location: location.value,
      start_date: startDate.value,
      end_date: endDate.value,
      calendar_date_id: calendarDateInput.value
    }

    form.addEventListener('submit', (e) => {
      event.preventDefault()
      calDateAdapter.makeNew(body)
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
