import { TestBed } from '@angular/core/testing';
import momentJalaali from 'moment-jalaali';
import { JalaliCalendarService } from './jalaliCalendarService';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  within these tests, we used fixed mock date to prevent failure in future     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

describe('JalaliCalendarService', () => {
  let service: JalaliCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JalaliCalendarService);
    service.initializeDate(); // Initialize with fixed date if needed
    service.currentDate = momentJalaali('1402-07-03'); // Set a fixed date for testing
  });

  it('should initialize with correct direction, icons, and text', () => {
    expect(service.calendarDirection).toBe('rtl');
    expect(service.previousMonthIconName).toBe('arrow_forward');
    expect(service.nextMonthIconName).toBe('arrow_back');
    expect(service.previousMonthText).toBe('ماه قبل');
    expect(service.nextMonthText).toBe('ماه بعد');
  });

  it('should fill the days of the month correctly', () => {
    const daysInMonth = service.getEndOfMonth().jDate();
    service.generateCalendarDays();

    expect(service.calendarDays.filter((day) => day.date > 0).length).toBe(
      daysInMonth
    );
  });

  it('should initialize the current date to the start of the day in the Jalali calendar', () => {
    const currentDate = service.initializeDate();
    expect(currentDate.isSame(momentJalaali().startOf('day'))).toBeTrue();
  });

  it('should return the start of the current Jalali month', () => {
    service.initializeDate();
    const startOfMonth = service.getStartOfMonth();
    expect(
      startOfMonth.isSame(service.currentDate.startOf('jMonth'))
    ).toBeTrue();
  });

  it('should return the end of the current Jalali month', () => {
    service.initializeDate();
    const endOfMonth = service.getEndOfMonth();
    expect(endOfMonth.isSame(service.currentDate.endOf('jMonth'))).toBeTrue();
  });

  it('should generate calendar days with correct start day offset and days of month', () => {
    service.initializeDate();
    service.generateCalendarDays();

    const startOfMonth = service.getStartOfMonth();
    const startDayOffset = (startOfMonth.day() + 1) % 7;
    const calendarDays = service.calendarDays;

    // Check that empty days are filled correctly
    expect(
      calendarDays
        .slice(0, startDayOffset)
        .every((day) => day.date === 0 && !day.isToday)
    ).toBeTrue();

    // Check the rest of the days are filled with dates from the month
    const actualDays = calendarDays.slice(startDayOffset);
    for (let i = 0; i < actualDays.length; i++) {
      const day = actualDays[i].date;
      const expectedDay = startOfMonth.clone().add(i, 'days').jDate();
      expect(day).toBe(expectedDay);
    }
  });

  it('should convert latin numbers to Persian numbers', () => {
    expect(service.latinToPersianNumber(123)).toBe('۱۲۳');
    expect(service.latinToPersianNumber('456')).toBe('۴۵۶');
  });

  it('should get the correct Jalali month and year', () => {
    const testDate = momentJalaali('1402-07-01', 'jYYYY-jMM-jDD');
    const { month, year } = service.getCurrentMonthAndYear(testDate);

    expect(month).toBe('مهر');
    expect(year).toBe('۱۴۰۲');
  });

  it('should fill empty days with 0 and isToday as false', () => {
    service.calendarDays = [];
    (service as any).fillEmptyDays(3); // Accessing private method

    expect(service.calendarDays.length).toBe(3);
    expect(
      service.calendarDays.every((day) => day.date === 0 && !day.isToday)
    ).toBeTrue();
  });

  it('should fill the days of the month and mark today correctly', () => {
    service.initializeDate();
    service.calendarDays = []; // Initialize calendarDays to an empty array

    const startOfMonth = service.getStartOfMonth();
    const endOfMonth = service.getEndOfMonth();
    const today = momentJalaali().startOf('day');

    // Call fillDaysOfMonth directly for testing
    (service as any).fillDaysOfMonth(startOfMonth, endOfMonth, today);

    // Log the calendar days for debugging purposes
    console.log('Generated Calendar Days:', service.calendarDays);

    // Check if today is correctly marked
    const hasToday = service.calendarDays.some(
      (day) => day.isToday && day.date === today.jDate()
    );
    expect(hasToday).toBeTrue();

    // Check the total count of days in the month (excluding empty days)
    const daysInMonth = endOfMonth.jDate();
    const actualFilledDays = service.calendarDays.filter(
      (day) => day.date > 0
    ).length;
    expect(actualFilledDays).toBe(daysInMonth);
  });
});
