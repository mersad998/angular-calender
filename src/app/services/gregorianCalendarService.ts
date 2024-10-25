import moment from 'moment';
import { Injectable } from '@angular/core';
import { CalendarServiceInterface } from '../calendar/calendar.component.types';
import { gregorianWeekDays } from '../calendar/calendar.component.helpers';

@Injectable({
  providedIn: 'root',
})
export class GregorianCalendarService implements CalendarServiceInterface {
  currentDate!: moment.Moment;
  calendarDays!: { date: number; isToday: boolean }[];
  weekDays: string[];
  calendarDirection = 'ltr' as CalendarServiceInterface['calendarDirection'];
  previousMonthIconName = 'arrow_back';
  nextMonthIconName = 'arrow_forward';
  previousMonthText = 'Previous';
  nextMonthText = 'Next';

  constructor() {
    this.weekDays = gregorianWeekDays;
  }

  // get the current date
  initializeDate() {
    return (this.currentDate = moment().startOf('day'));
  }

  // get the start of the month
  getStartOfMonth() {
    return this.currentDate.clone().startOf('month');
  }

  // get the end of the month
  getEndOfMonth() {
    return this.currentDate.clone().endOf('month');
  }

  // Add placeholder days to align the first day of the month with the correct weekday.
  generateCalendarDays() {
    const startOfMonth = this.getStartOfMonth();
    const endOfMonth = this.getEndOfMonth();
    const today = moment();

    this.calendarDays = [];
    const startDayOffset = (startOfMonth.day() + 1) % 7;

    this.fillEmptyDays(startDayOffset);
    this.fillDaysOfMonth(startOfMonth, endOfMonth, today);

    return this.calendarDays;
  }

  // get the current ( georgian ) month and year
  getCurrentMonthAndYear(date: moment.Moment): { month: string; year: string } {
    return {
      month: date.format('MMMM'), // e.g., "October"
      year: date.year().toString(), // e.g., 2023
    };
  }

  // fill the days of the month ( 1 - 31 )
  private fillDaysOfMonth(
    startOfMonth: moment.Moment,
    endOfMonth: moment.Moment,
    today: moment.Moment
  ) {
    const dateGetter = 'date';

    for (
      let day = startOfMonth[dateGetter]();
      day <= endOfMonth[dateGetter]();
      day++
    ) {
      const date = startOfMonth.clone()[dateGetter](day);
      const isToday = date.isSame(today, 'day');
      this.calendarDays.push({ date: day, isToday });
    }
  }

  // fill the empty days with 0
  private fillEmptyDays(count: number) {
    for (let i = 0; i < count; i++) {
      this.calendarDays.push({ date: 0, isToday: false });
    }
  }
}
