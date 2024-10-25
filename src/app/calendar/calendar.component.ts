import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import moment from 'moment';

import { calendarTypes } from './calendar.component.helpers';
import { CalendarServiceFactory } from '../services/calendarServiceFactory';
import {
  type CalendarDay,
  type CalendarTypeOption,
  CalendarServiceInterface,
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
  // Inject the CalendarServiceFactory to create the appropriate calendar service.
  constructor(
    @Inject(CalendarServiceFactory)
    private calendarServiceFactory: {
      initializeService: (
        type: CalendarType.Gregorian | CalendarType.Jalali
      ) => CalendarServiceInterface;
    }
  ) {
    // Initialize the calendar types dropdown options.
    this.calendarTypes = calendarTypes;
  }

  // when component initiated
  ngOnInit() {
    this.updateCalendarService(this.selectedCalendarType); // set the calendar service with default value (Gregorian)
    this.updateCurrentDate(); // set the `currentDate` variables trough calendar service
    this.updateCalendarDaysAndHeaders(); // set the calendar view based on the current date
  }

  /**
   * * * * * * * * * * * * * * * *
   *  class variables            *
   * * * * * * * * * * * * * * * *
   */

  // Calendar service to handle calendar-related functions
  calendarService!: CalendarServiceInterface;

  // Dropdown options for calendar types (Jalali and Gregorian)
  calendarTypes!: CalendarTypeOption[];

  // Stores the currently selected calendar type trough dropdown (Gregorian by default)
  selectedCalendarType: CalendarType = CalendarType.Gregorian;

  // Current date object, used to determine the current year, month, and day
  currentDate!: moment.Moment;

  // Current year as a formatted and localized string, updated on month change
  currentYear: string = '';

  // Current month as a formatted and localized string, updated on month change
  currentMonth: string = '';

  // Array of days to be displayed in the calendar grid.
  calendarDays: CalendarDay[] = [];

  /**
   * * * * * * * * * * * * * * * *
   *  event handlers             *
   * * * * * * * * * * * * * * * *
   */

  // Navigates to the previous month
  goToPreviousMonth() {
    this.currentDate = this.currentDate.add(-1, 'month'); // subtract one month from the current date
    this.updateCalendarDaysAndHeaders(); // update the calendar view based on the new date
  }

  // Navigates to the next month
  goToNextMonth() {
    this.currentDate = this.currentDate.add(1, 'month'); // add one month to the current date
    this.updateCalendarDaysAndHeaders(); // update the calendar view based on the new date
  }

  // Event handler for when the user changes the calendar type
  onCalendarTypeChange(event: { value: CalendarType }) {
    this.selectedCalendarType = event.value; // update the selected calendar type variable
    this.updateCalendarService(event.value); // call service factory to update the calendar service based on the selected type
    this.updateCurrentDate(); // set the `currentDate` variables trough calendar service
    this.updateCalendarDaysAndHeaders(); // set the calendar view based on the current date
  }

  // each calendar type has its own service, this function updates the calendar service based on the selected calendar type
  private updateCalendarService(calendarType: CalendarType) {
    this.calendarService =
      this.calendarServiceFactory.initializeService(calendarType);
  }

  /**
   * * * * * * * * * * * * * * * *
   *  utility functions          *
   * * * * * * * * * * * * * * * *
   */

  // use the calendar service to get the localized day text ( persian / latin characters )
  getLocalizedDayText(day: number) {
    return this.calendarService?.latinToPersianNumber
      ? this.calendarService.latinToPersianNumber(day)
      : day;
  }

  /**
   * * * * * * * * * * * * * * * *
   *  service controllers        *
   * * * * * * * * * * * * * * * *
   */

  // set local `currentDate` variable based on the current date in calendar service
  private updateCurrentDate() {
    if (this.calendarService) {
      this.currentDate = this.calendarService.initializeDate();
    }
  }

  // Updates the calendar view (header info and days) based on the current date
  private updateCalendarDaysAndHeaders() {
    this.updateCurrentMonthAndYear(); // header info
    this.generateCalendarDays(); // calendar days
  }

  // Updates the current month and year based on the selected calendar type
  // this value is used to display the current month and year in the calendar header
  private updateCurrentMonthAndYear() {
    if (this.calendarService) {
      // use the calendar service to get the current month and year based on the current calendar type
      const { month, year } = this.calendarService.getCurrentMonthAndYear(
        this.currentDate
      );

      // update local variables
      this.currentMonth = month;
      this.currentYear = year;
    }
  }

  // Add empty cells to align the first day of the month with the correct weekday.
  private generateCalendarDays() {
    if (this.calendarService) {
      // use the calendar service to generate the calendar days based on the current date
      this.calendarDays = this.calendarService.generateCalendarDays(
        this.currentDate
      );
    }
  }

  /**
   * * * * * * * * * * * * * * * *
   *  getters for use in HTML    *
   * * * * * * * * * * * * * * * *
   */

  // get the localized week days ( persian / latin week days )
  get weekDays() {
    return this.calendarService?.weekDays ?? [];
  }

  // get the formatted current month ( persian / latin month )
  get formattedCurrentYear() {
    return this.currentYear;
  }

  // get the calendar direction ( rtl / ltr )
  get calendarDirection() {
    return this.calendarService.calendarDirection;
  }

  // get the previous month icon name ( arrow_forward / arrow_back )
  get previousIcon() {
    return this.calendarService.previousMonthIconName;
  }

  // get the next month icon name ( arrow_forward / arrow_back )
  get nextIcon() {
    return this.calendarService.nextMonthIconName;
  }

  // get the previous month text ( persian / latin text )
  get previousText() {
    return this.calendarService.previousMonthText;
  }

  // get the next month text ( persian / latin text )
  get nextText() {
    return this.calendarService.nextMonthText;
  }
}
