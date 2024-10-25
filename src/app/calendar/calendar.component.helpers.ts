import { CalendarType, CalendarTypeOption } from './calendar.component.types';

export const jalaliMonthTranslations: { [key: string]: string } = {
  Farvardin: 'فروردین',
  Ordibehesht: 'اردیبهشت',
  Khordaad: 'خرداد',
  Tir: 'تیر',
  Amordaad: 'مرداد',
  Shahrivar: 'شهریور',
  Mehr: 'مهر',
  Aabaan: 'آبان',
  Aazar: 'آذر',
  Dey: 'دی',
  Bahman: 'بهمن',
  Esfand: 'اسفند',
};

export const jalaliWeekDays = [
  'شنبه',
  'یک شنبه',
  'دو شنبه',
  'سه شنبه',
  'چهار شنبه',
  'پنج شنبه',
  'جمعه',
];

export const gregorianWeekDays = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

/**
 * Dropdown options for calendar types (Jalali and Gregorian).
 * @type {CalendarTypeOption[]}
 */
export const calendarTypes: CalendarTypeOption[] = [
  { value: CalendarType.Gregorian, viewValue: 'میلادی' },
  { value: CalendarType.Jalali, viewValue: 'شمسی' },
];
