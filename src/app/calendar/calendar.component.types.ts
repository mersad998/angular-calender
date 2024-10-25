export enum CalendarType {
  Gregorian = 'gregorian',
  Jalali = 'jalali',
}

export interface CalendarDay {
  date: number;
  isToday: boolean;
}

export interface CalendarTypeOption {
  value: CalendarType;
  viewValue: string;
}

export interface CalendarServiceInterface {
  initializeDate(): moment.Moment; // Initialize the date based on calendar type
  getStartOfMonth(currentDate: moment.Moment): moment.Moment;
  getEndOfMonth(currentDate: moment.Moment): moment.Moment;
  getCurrentMonthAndYear(currentDate: moment.Moment): {
    month: string;
    year: string;
  };
  generateCalendarDays(currentDate: moment.Moment): CalendarDay[];
  latinToPersianNumber?(number: string | number): string; // Optional for Jalali service

  weekDays: string[];
  calendarDirection: 'rtl' | 'ltr';
  previousMonthIconName: string;
  nextMonthIconName: string;
  previousMonthText: string;
  nextMonthText: string;
}
