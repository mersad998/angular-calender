import { Component, Injectable, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import momentJalaali from 'moment-jalaali';
import { CommonModule } from '@angular/common';
import {
  jalaliMonthTranslations,
  jalaliWeekDays,
  gregorianWeekDays,
} from '../calendar/calendar.component.helpers';
import {
  type CalendarDay,
  type CalendarTypeOption,
  CalendarServiceInterface,
  CalendarType,
} from '../calendar/calendar.component.types';

@Injectable({
  providedIn: 'root',
})
export class GregorianCalendarService implements CalendarServiceInterface {
  currentDate!: moment.Moment;
  isJalali = false;
  calendarDays!: any[];

  /**
   * Initializes the currentDate to the start of the day,
   * depending on the selected calendar type.
   */
  initializeDate() {
    return (this.currentDate = this.isJalali
      ? momentJalaali().startOf('day')
      : moment().startOf('day'));
  }

  /**
   * Retrieves the start date of the current month, adjusted for calendar type.
   * @returns {moment.Moment} - The start date of the month.
   */
  getStartOfMonth() {
    return this.isJalali
      ? momentJalaali(this.currentDate).startOf('jMonth')
      : this.currentDate.clone().startOf('month');
  }

  /**
   * Retrieves the end date of the current month, adjusted for calendar type.
   * @returns {moment.Moment} - The end date of the month.
   */
  getEndOfMonth() {
    return this.isJalali
      ? momentJalaali(this.currentDate).endOf('jMonth')
      : this.currentDate.clone().endOf('month');
  }

  /**
   * Generates the array of days to display in the calendar view.
   * It includes empty days for alignment and actual dates.
   */
  generateCalendarDays() {
    const startOfMonth = this.getStartOfMonth();
    const endOfMonth = this.getEndOfMonth();
    const today = this.isJalali ? momentJalaali() : moment();

    this.calendarDays = [];
    const startDayOffset = (startOfMonth.day() + 1) % 7;

    this.fillEmptyDays(startDayOffset);
    this.fillDaysOfMonth(startOfMonth, endOfMonth, today);

    return this.calendarDays;
  }

  /**
   * Converts Latin numbers to Persian numerals.
   * @param {string | number} latinNumber - The number to convert.
   * @returns {string} - The number in Persian numerals.
   */
  latinToPersianNumber = (latinNumber: string | number) =>
    latinNumber?.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

  
  getCurrentMonthAndYear(date: moment.Moment): { month: string; year: number } {
    return {
      month: date.format('MMMM'), // e.g., "October"
      year: date.year(), // e.g., 2023
    };
  }

  /**
   * Fills the calendar view with the actual days of the month.
   * Marks the current day if it matches today's date.
   * @param {moment.Moment} startOfMonth - The start date of the month.
   * @param {moment.Moment} endOfMonth - The end date of the month.
   * @param {moment.Moment} today - The current day.
   */
  private fillDaysOfMonth(
    startOfMonth: moment.Moment,
    endOfMonth: moment.Moment,
    today: moment.Moment
  ) {
    const dateGetter = this.isJalali ? 'jDate' : 'date';

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

  /**
   * Fills the calendar view with empty days for alignment purposes.
   * @param {number} count - The number of empty days to insert.
   */
  private fillEmptyDays(count: number) {
    for (let i = 0; i < count; i++) {
      this.calendarDays.push({ date: 0, isToday: false });
    }
  }
}
