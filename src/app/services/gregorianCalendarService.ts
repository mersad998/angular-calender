import moment from 'moment';
import { Injectable } from '@angular/core';
import { CalendarServiceInterface } from '../calendar/calendar.component.types';
import { gregorianWeekDays } from '../calendar/calendar.component.helpers';

@Injectable({
  providedIn: 'root',
})
export class GregorianCalendarService implements CalendarServiceInterface {
  currentDate!: moment.Moment;
  calendarDays!: any[];
  weekDays: string[];
  calendarDirection = 'ltr' as CalendarServiceInterface['calendarDirection'];
  previousMonthIconName = 'arrow_back';
  nextMonthIconName = 'arrow_forward';
  previousMonthText = 'Previous';
  nextMonthText = 'Next';

  constructor() {
    this.weekDays = gregorianWeekDays;
  }

  initializeDate() {
    return (this.currentDate = moment().startOf('day'));
  }

  getStartOfMonth() {
    return this.currentDate.clone().startOf('month');
  }

  getEndOfMonth() {
    return this.currentDate.clone().endOf('month');
  }

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

  getCurrentMonthAndYear(date: moment.Moment): { month: string; year: string } {
    return {
      month: date.format('MMMM'), // e.g., "October"
      year: date.year().toString(), // e.g., 2023
    };
  }

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

  private fillEmptyDays(count: number) {
    for (let i = 0; i < count; i++) {
      this.calendarDays.push({ date: 0, isToday: false });
    }
  }
}
