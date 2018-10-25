class DOMController {
  constructor() {
    this.calendar = document.getElementById('custom-cal')
    prevMonthBtn = document.getElementById('prev-month')
    nextMonthBtn = document.getElementById('next-month')
  }

  datesInMonth() {
    return this.calendar.getElementByClassName('in-month')
  }
}
