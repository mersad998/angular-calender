import { Injectable } from '@angular/core';
import moment from 'moment';
import momentJalaali from 'moment-jalaali';
import {
  jalaliMonthTranslations,
  jalaliWeekDays,
} from '../calendar/calendar.component.helpers';
import { CalendarServiceInterface } from '../calendar/calendar.component.types';

@Injectable({
  providedIn: 'root',
})
export class JalaliCalendarService implements CalendarServiceInterface {
  jalaliMonthTranslations: { [key: string]: string };
  weekDays: string[];
  calendarDirection = 'rtl' as CalendarServiceInterface['calendarDirection'];
  previousMonthIconName = 'arrow_forward';
  nextMonthIconName = 'arrow_back';
  previousMonthText = 'ماه قبل';
  nextMonthText = 'ماه بعد';

  constructor() {
    this.jalaliMonthTranslations = jalaliMonthTranslations;
    this.weekDays = jalaliWeekDays;
  }

  currentDate!: moment.Moment;
  calendarDays!: any[];

  initializeDate() {
    return (this.currentDate = momentJalaali().startOf('day'));
  }

  getStartOfMonth() {
    return momentJalaali(this.currentDate).startOf('jMonth');
  }

  getEndOfMonth() {
    return momentJalaali(this.currentDate).endOf('jMonth');
  }

  generateCalendarDays() {
    const startOfMonth = this.getStartOfMonth();
    const endOfMonth = this.getEndOfMonth();
    const today = momentJalaali();

    this.calendarDays = [];
    const startDayOffset = (startOfMonth.day() + 1) % 7;

    this.fillEmptyDays(startDayOffset);
    this.fillDaysOfMonth(startOfMonth, endOfMonth, today);

    return this.calendarDays;
  }

  latinToPersianNumber = (latinNumber: string | number) =>
    latinNumber?.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

  getCurrentMonthAndYear(date: moment.Moment): { month: string; year: string } {
    return {
      month: jalaliMonthTranslations[date.format('jMMMM')], // e.g., "مهر"
      year: this.latinToPersianNumber(date.jYear()).toString(), // e.g., 1402
    };
  }

  private fillDaysOfMonth(
    startOfMonth: moment.Moment,
    endOfMonth: moment.Moment,
    today: moment.Moment
  ) {
    const dateGetter = 'jDate';

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
