import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import momentJalaali from 'moment-jalaali';
import { CommonModule } from '@angular/common';
import {
  jalaliWeekDays,
  gregorianWeekDays,
} from './calendar.component.helpers';
import {
  type CalendarDay,
  type CalendarTypeOption,
  CalendarServiceInterface,
  CalendarType,
} from './calendar.component.types';
import { CalendarServiceFactory } from '../services/calendarServiceFactory';

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
  calendarService!: CalendarServiceInterface;

  constructor(
    @Inject(CalendarServiceFactory)
    private calendarServiceFactory: {
      initializeService: (
        type: CalendarType.Gregorian | CalendarType.Jalali
      ) => CalendarServiceInterface;
    }
  ) {
    // dependency injection
  }

  /**
   * Angular lifecycle method that initializes the component state.
   * Calls the methods to initialize the date and update the calendar view.
   */
  ngOnInit() {
    this.updateCalendarService(this.selectedCalendarType);

    this.initializeDate();
    this.updateCalendar();
  }

  private updateCalendarService(calendarType: CalendarType) {
    this.calendarService =
      this.calendarServiceFactory.initializeService(calendarType);
  }

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

  /**
   * Handles changes in the calendar type selection.
   * Updates week days and calendar view based on the new type.
   * @param {any} event - Event object containing the selected calendar type.
   */
  onCalendarTypeChange(event: { value: CalendarType }) {
    this.selectedCalendarType = event.value;
    this.updateCalendarService(event.value);
    this.initializeDate();
    this.updateWeekDays();
    this.updateCalendar();
  }

  private initializeDate() {
    if (this.calendarService) {
      this.currentDate = this.calendarService.initializeDate();
    }
  }

  /**
   * Navigates to the previous month.
   */
  goToPreviousMonth() {
    this.currentDate = this.currentDate.add(-1, 'month');
    this.updateCalendar();
  }

  /**
   * Navigates to the next month.
   */
  goToNextMonth() {
    this.currentDate = this.currentDate.add(1, 'month');
    this.updateCalendar();
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
   * Updates the calendar view by setting the current month and year
   * and generating the days to be displayed.
   */
  private updateCalendar() {
    this.updateCurrentMonthAndYear();
    this.generateCalendarDays();
  }
  private generateCalendarDays() {
    if (this.calendarService) {
      this.calendarDays = this.calendarService.generateCalendarDays(
        this.currentDate
      );
    }
  }
  /**
   * Updates the current month and year based on the selected calendar type.
   */
  private updateCurrentMonthAndYear() {
    if (this.calendarService) {
      const { month, year } = this.calendarService.getCurrentMonthAndYear(
        this.currentDate
      );
      this.currentMonth = month;
      this.currentYear = year;
    }
  }

  /**
   * Formats the given day based on the selected calendar type.
   * @param {number} day - The day number to format.
   * @returns {string | number} - The formatted day.
   */
  formattedDay(day: number) {
    return this.isJalali && this.calendarService?.latinToPersianNumber
      ? this.calendarService.latinToPersianNumber(day)
      : day;
  }

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
      ? this.calendarService.latinToPersianNumber(this.currentYear)
      : this.currentYear;
  }
}
