function makeDetailViewHTML(target) {
  const calDateId = parseInt(target.getAttribute('cal-date-id'))
  const calendarDate = CalendarDate.findById(calDateId)
  if (calendarDate) {
    const events = calendarDate.getEvents()
    eventsHTML = makeEventCards(events)
    const container = document.getElementById('date-detail-container')
    eventsHTML.forEach( (eventHTML) => {
      container.appendChild(eventHTML)
    })
  }
}

function makeEventCards(events) {
  return events.map( (event) => {
    const card = document.createElement('div')
    card.className = 'detail-item'
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

function closeDetailView() {
  const detail = document.getElementById('date-detail-container')
  detail.innerHTML = ''
  const cal = document.getElementById('custom-cal')
  cal.classList.remove('shrunk')
}

function makeDetailCloseBtn(element, dateSquare) {
  const closeBtn = document.createElement('div')
  closeBtn.classList.add('detail-item')
  closeBtn.classList.add('btn')
  closeBtn.id = 'close-btn'
  closeBtn.innerText = '[Close]'
  closeBtn.addEventListener('click', (event) => {
    closeDetailView()
    dateSquare.classList.remove('clicked') // stop blinking on cal
  })
  element.appendChild(closeBtn)
}

function makeDetailNewBtn(element, dateSquare) {
  const newBtn = document.createElement('div')
  newBtn.classList.add('detail-item')
  newBtn.classList.add('btn')
  newBtn.id = 'new-btn'
  newBtn.innerText = '[New]'
  newBtn.addEventListener('click', (event) => {
    openNewEventForm(dateSquare)
  })
  element.appendChild(newBtn)
}

function openNewEventForm(dateSquare) {
  const dom = new DOMController()
  const form = document.createElement('form')
  form.id = 'new-event-form'
  form.className = 'detail-item'

  const day = dom.getDateFromSquareSpan(dateSquare)
  const month = calDate.getMonth()
  const year = calDate.getFullYear()
  form.setAttribute('data-day', day)
  form.setAttribute('data-month', month)
  form.setAttribute('data-year', year)

  const titleField = document.createElement('input')
  titleField.id = 'title-input'
  titleField.placeholder = 'What...'
  const locationField = document.createElement('input')
  locationField.id = 'location-input'
  locationField.placeholder = 'Where...'

  const submit = document.createElement('input')
  submit.type = 'submit'
  submit.id = 'new-form-submit'


  form.appendChild(titleField)
  form.appendChild(locationField)
  form.appendChild(submit)

  dom.dateDetailContainer.appendChild(form)
  setSubmitListener()
}

function openDetailView(target) {
  const detail = document.getElementById('date-detail-container')
  makeDetailCloseBtn(detail, target)
  makeDetailNewBtn(detail, target)
  const date = CalendarDate.getDateFromElement(target)
  makeDetailViewHTML(target)
  return
  // detail.appendChild(detailHTML)
}
