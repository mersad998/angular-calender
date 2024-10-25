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
  getTest(): string;
}
