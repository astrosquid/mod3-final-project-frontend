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

function closeDetailView() {
  const detail = document.getElementById('date-detail-container')
  detail.innerHTML = ''
  const cal = document.getElementById('custom-cal')
  cal.classList.remove('shrunk')
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
