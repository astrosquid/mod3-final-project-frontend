class DOMController {
  constructor() {
    this.calendar = document.getElementById('custom-cal')
    this.dateDetailContainer = document.getElementById('date-detail-container')
    this.prevMonthBtn = document.getElementById('prev-month')
    this.nextMonthBtn = document.getElementById('next-month')
  }

  datesInMonth() {
    return this.calendar.getElementsByClassName('in-month')
  }

  getDateFromSquareSpan(dateSquare) {
    return parseInt(dateSquare.querySelector('span').innerText)
  }
}
