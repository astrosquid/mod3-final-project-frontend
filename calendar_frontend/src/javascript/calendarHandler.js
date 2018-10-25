class CalendarHandler {
  static initCalendar() {
    document.getElementById('month-label').innerText = `${getMonthByNum(calDate.getMonth())}, ${calDate.getFullYear()}`
    const cal = document.getElementById('custom-cal')
    cal.className = getMonthByNum(calDate.getMonth())
    this.removeDateNums()
    this.resetCalendarAttributes()
    this.populateCalendarWithDays()
  }

  static removeDateNums() {
    const dateNums = document.querySelectorAll('.date-num')
    dateNums.forEach( (dateNum) => {
      dateNum.remove()
    })
  }

  static resetCalendarAttributes() {
    const dates = document.querySelectorAll('.date')
    dates.forEach( (date) => {
      date.removeAttribute('date-square')
      date.className = 'col date'
    })
  }

  static populateCalendarWithDays() {
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

        // set count of events on that day within square
        const calendarDate = getDateFromElement(date)
        currentDate += 1
      }
    })
  }

  static setWeekdaysOnCalendar() {
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
}
