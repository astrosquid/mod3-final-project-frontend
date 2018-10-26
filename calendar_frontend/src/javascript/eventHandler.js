
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

function setListenerOnCustomCal(calDateAdapter) {
  const cal = document.getElementById('custom-cal')
  cal.addEventListener('click', (event) => {
    if (event.target && event.target.getAttribute('date-square') === 'true') {
      CalendarHandler.clearClickedFromDates()
      event.target.className += ' clicked'
      const calendarDate = CalendarDate.getDateFromElement(event.target)

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

function setListenerOnMonthBtns() {
  const prevMonthBtn = document.getElementById('prev-month')
  const nextMonthBtn = document.getElementById('next-month')

  prevMonthBtn.addEventListener('click', (e) => {
    calDate.setMonth(calDate.getMonth() - 1)
    CalendarHandler.initCalendar()
  })

  nextMonthBtn.addEventListener('click', (e) => {
    calDate.setMonth(calDate.getMonth() + 1)
    CalendarHandler.initCalendar()
  })
}

function setSubmitListener() {
  const submit = document.getElementById('new-form-submit')
  submit.addEventListener('click', (event) => {
    event.preventDefault()
    const form = document.getElementById('new-event-form')
    const day = form.getAttribute('data-day')
    const month = form.getAttribute('data-month')
    const year = form.getAttribute('data-year')
    const date = new Date(year, month, day)
    const calAdapter = new Adapter('http://localhost:3000/api/v1/calendar_dates')
    calAdapter.new({ date })
    .then( res => res.json() )
    .then( json => {
      console.log(json)
      const eventAdapter = new Adapter('http://localhost:3000/api/v1/events')
      const title = document.getElementById('title-input')
      const location = document.getElementById('location-input')
      eventAdapter.new({ title: title.value, location: location.value, calendar_date_id: json.id})
      .then( res => res.json() )
      .then( eventJSON => {
        console.log(eventJSON)
        form.remove()
      })
    })
  })
}
