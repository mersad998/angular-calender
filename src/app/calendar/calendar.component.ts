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
  calendarTypes,
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
  calendarTypes!: CalendarTypeOption[];

  constructor(
    @Inject(CalendarServiceFactory)
    private calendarServiceFactory: {
      initializeService: (
        type: CalendarType.Gregorian | CalendarType.Jalali
      ) => CalendarServiceInterface;
    }
  ) {
    // dependency injection

    this.calendarTypes = calendarTypes;
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

  /**
   * Stores the currently selected calendar type.
   * @type {CalendarType}
   */
  selectedCalendarType: CalendarType = CalendarType.Gregorian;

  /**
   * Current month as a formatted string, updated on month change.
   * @type {string}
   */
  currentMonth: string = '';

  /**
   * Array of days to be displayed in the calendar grid.
   * @type {CalendarDay[]}
   */
  calendarDays: CalendarDay[] = [];

  /**
   * Handles changes in the calendar type selection.
   * Updates week days and calendar view based on the new type.
   * @param {any} event - Event object containing the selected calendar type.
   */
  onCalendarTypeChange(event: { value: CalendarType }) {
    this.selectedCalendarType = event.value;
    this.updateCalendarService(event.value);
    this.initializeDate();
    this.updateCalendar();
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
   * Formats the given day based on the selected calendar type.
   * @param {number} day - The day number to format.
   * @returns {string | number} - The formatted day.
   */
  formattedDay(day: number) {
    return this.calendarService?.latinToPersianNumber
      ? this.calendarService.latinToPersianNumber(day)
      : day;
  }

  /**
   * Current year, formatted according to the selected calendar type.
   * @type {number}
   */
  private currentYear: string = '';

  /**
   * Internal variable to track the currently displayed date.
   * @type {moment.Moment}
   */
  private currentDate!: moment.Moment;

  private updateCalendarService(calendarType: CalendarType) {
    this.calendarService =
      this.calendarServiceFactory.initializeService(calendarType);
  }

  private initializeDate() {
    if (this.calendarService) {
      this.currentDate = this.calendarService.initializeDate();
    }
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

  // get ui properties

  /**
   * List of days in a week, dynamically updated based on calendar type.
   * @type {string[]}
   */
  get weekDays() {
    return this.calendarService?.weekDays ?? [];
  }

  /**
   * Determines the direction of the calendar based on calendar type.
   * @returns {string} - 'rtl' if Jalali, 'ltr' if Gregorian.
   */
  get calendarDirection() {
    return this.calendarService.calendarDirection;
  }

  get previousIcon() {
    return this.calendarService.previousMonthIconName;
  }

  get nextIcon() {
    return this.calendarService.nextMonthIconName;
  }

  get previousText() {
    return this.calendarService.previousMonthText;
  }

  get nextText() {
    return this.calendarService.nextMonthText;
  }

  /**
   * Formats the current year based on calendar type.
   * @returns {string | number} - The formatted year.
   */
  get formattedCurrentYear() {
    return this.currentYear;
  }
}
