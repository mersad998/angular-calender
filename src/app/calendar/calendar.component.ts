import { Component, OnInit } from '@angular/core';
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
} from './calendar.component.helpers';
import {
  type CalendarDay,
  type CalendarTypeOption,
  CalendarType,
} from './calendar.component.types';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  /**
   * Translation of Jalali month names from Latin characters to Persian.
   * @constant {Object} jalaliMonthTranslations
   */
  jalaliMonthTranslations: { [key: string]: string };

  /**
   * Dropdown options for calendar types (Jalali and Gregorian).
   * @type {CalendarTypeOption[]}
   */
  calendarTypes: CalendarTypeOption[] = [
    { value: CalendarType.Gregorian, viewValue: 'میلادی' },
    { value: CalendarType.Jalali, viewValue: 'شمسی' },
  ];

  /**
   * Stores the currently selected calendar type.
   * @type {CalendarType}
   */
  selectedCalendarType: CalendarType = CalendarType.Gregorian;

  /**
   * List of days in a week, dynamically updated based on calendar type.
   * @type {string[]}
   */
  weekDays = gregorianWeekDays;

  /**
   * Current month as a formatted string, updated on month change.
   * @type {string}
   */
  currentMonth: string = '';

  /**
   * Current year, formatted according to the selected calendar type.
   * @type {number}
   */
  currentYear: number = 0;

  /**
   * Array of days to be displayed in the calendar grid.
   * @type {CalendarDay[]}
   */
  calendarDays: CalendarDay[] = [];

  /**
   * Internal variable to track the currently displayed date.
   * @type {moment.Moment}
   */
  private currentDate!: moment.Moment;

  constructor() {
    // Initialize Jalali month translations from helper.
    this.jalaliMonthTranslations = jalaliMonthTranslations;
  }

  /**
   * Angular lifecycle method that initializes the component state.
   * Calls the methods to initialize the date and update the calendar view.
   */
  ngOnInit() {
    this.initializeDate();
    this.updateCalendar();
  }

  /**
   * Handles changes in the calendar type selection.
   * Updates week days and calendar view based on the new type.
   * @param {any} event - Event object containing the selected calendar type.
   */
  onCalendarTypeChange(event: any) {
    this.selectedCalendarType = event.value;
    this.initializeDate();
    this.updateWeekDays();
    this.updateCalendar();
  }

  /**
   * Navigates to the previous month.
   */
  goToPreviousMonth() {
    this.changeMonth(-1);
  }

  /**
   * Navigates to the next month.
   */
  goToNextMonth() {
    this.changeMonth(1);
  }

  /**
   * Initializes the currentDate to the start of the day,
   * depending on the selected calendar type.
   */
  private initializeDate() {
    this.currentDate = this.isJalali
      ? momentJalaali().startOf('day')
      : moment().startOf('day');
  }

  /**
   * Updates the `weekDays` array based on the selected calendar type.
   */
  private updateWeekDays() {
    this.weekDays = this.isJalali ? jalaliWeekDays : gregorianWeekDays;
  }

  /**
   * Adjusts the current month by a given number of months.
   * Updates the calendar view to reflect the new month.
   * @param {number} step - The number of months to adjust by (positive or negative).
   */
  private changeMonth(step: number) {
    this.currentDate = this.currentDate.add(step, 'month');
    this.updateCalendar();
  }

  /**
   * Determines if the selected calendar type is Jalali.
   * @returns {boolean} - True if the calendar type is Jalali, false otherwise.
   */
  private get isJalali(): boolean {
    return this.selectedCalendarType === CalendarType.Jalali;
  }

  /**
   * Retrieves the start date of the current month, adjusted for calendar type.
   * @returns {moment.Moment} - The start date of the month.
   */
  private getStartOfMonth() {
    return this.isJalali
      ? momentJalaali(this.currentDate).startOf('jMonth')
      : this.currentDate.clone().startOf('month');
  }

  /**
   * Retrieves the end date of the current month, adjusted for calendar type.
   * @returns {moment.Moment} - The end date of the month.
   */
  private getEndOfMonth() {
    return this.isJalali
      ? momentJalaali(this.currentDate).endOf('jMonth')
      : this.currentDate.clone().endOf('month');
  }

  /**
   * Updates the calendar view by setting the current month and year
   * and generating the days to be displayed.
   */
  private updateCalendar() {
    this.updateCurrentMonthAndYear();
    this.generateCalendarDays();
  }

  /**
   * Updates the current month and year based on the selected calendar type.
   */
  private updateCurrentMonthAndYear() {
    if (this.isJalali) {
      this.currentMonth =
        this.jalaliMonthTranslations[this.currentDate.format('jMMMM')] || '';
      this.currentYear = this.currentDate.jYear();
    } else {
      this.currentMonth = this.currentDate.format('MMMM');
      this.currentYear = this.currentDate.year();
    }
  }

  /**
   * Generates the array of days to display in the calendar view.
   * It includes empty days for alignment and actual dates.
   */
  private generateCalendarDays() {
    const startOfMonth = this.getStartOfMonth();
    const endOfMonth = this.getEndOfMonth();
    const today = this.isJalali ? momentJalaali() : moment();

    this.calendarDays = [];
    const startDayOffset = (startOfMonth.day() + 1) % 7;

    this.fillEmptyDays(startDayOffset);
    this.fillDaysOfMonth(startOfMonth, endOfMonth, today);
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
   * Converts Latin numbers to Persian numerals.
   * @param {string | number} latinNumber - The number to convert.
   * @returns {string} - The number in Persian numerals.
   */
  private latinToPersianNumber = (latinNumber: string | number) =>
    latinNumber?.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

  /**
   * Determines the direction of the calendar based on calendar type.
   * @returns {string} - 'rtl' if Jalali, 'ltr' if Gregorian.
   */
  get calendarDirection() {
    return this.isJalali ? 'rtl' : 'ltr';
  }

  /**
   * Determines the icon for the previous month button based on calendar type.
   * @returns {string} - The icon name ('arrow_forward' or 'arrow_back').
   */
  get previousIcon() {
    return this.isJalali ? 'arrow_forward' : 'arrow_back';
  }

  /**
   * Determines the icon for the next month button based on calendar type.
   * @returns {string} - The icon name ('arrow_back' or 'arrow_forward').
   */
  get nextIcon() {
    return this.isJalali ? 'arrow_back' : 'arrow_forward';
  }

  /**
   * Determines the label for the previous month button.
   * @returns {string} - 'ماه قبل' for Jalali, 'Previous' for Gregorian.
   */
  get previousText() {
    return this.isJalali ? 'ماه قبل' : 'Previous';
  }

  /**
   * Determines the label for the next month button.
   * @returns {string} - 'ماه بعد' for Jalali, 'Next' for Gregorian.
   */
  get nextText() {
    return this.isJalali ? 'ماه بعد' : 'Next';
  }

  /**
   * Formats the current year based on calendar type.
   * @returns {string | number} - The formatted year.
   */
  get formattedCurrentYear() {
    return this.isJalali
      ? this.latinToPersianNumber(this.currentYear)
      : this.currentYear;
  }

  /**
   * Formats the given day based on the selected calendar type.
   * @param {number} day - The day number to format.
   * @returns {string | number} - The formatted day.
   */
  formattedDay(day: number) {
    return this.isJalali ? this.latinToPersianNumber(day) : day;
  }
}
