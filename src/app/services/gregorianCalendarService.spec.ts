import { TestBed } from '@angular/core/testing';
import moment from 'moment';
import { GregorianCalendarService } from './gregorianCalendarService';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *  within these tests, we used fixed mock date to prevent failure in future     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 */

describe('GregorianCalendarService', () => {
  let service: GregorianCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GregorianCalendarService],
    });
    service = TestBed.inject(GregorianCalendarService);
    service.initializeDate(); // Initialize with fixed date if needed
    service.currentDate = moment('2023-10-25'); // Set a fixed date for testing
  });

  it('should fill the days of the month correctly', () => {
    const daysInMonth = service.getEndOfMonth().date();
    service.generateCalendarDays();

    expect(service.calendarDays.filter((day) => day.date > 0).length).toBe(
      daysInMonth
    );
  });

  it('should create an instance of GregorianCalendarService', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize the current date', () => {
    const currentDate = service.initializeDate();
    expect(currentDate).toBeInstanceOf(moment);
    expect(currentDate.isSame(moment(), 'day')).toBeTrue();
  });

  it('should return the start of the month', () => {
    service.initializeDate();
    const startOfMonth = service.getStartOfMonth();
    expect(startOfMonth.date()).toBe(1);
  });

  it('should return the end of the month', () => {
    service.initializeDate();
    const endOfMonth = service.getEndOfMonth();
    const daysInMonth = moment().daysInMonth();
    expect(endOfMonth.date()).toBe(daysInMonth);
  });

  it('should generate calendar days for the current month with correct empty day offsets', () => {
    service.initializeDate();
    const calendarDays = service.generateCalendarDays();
    const startOfMonth = service.getStartOfMonth();
    const startDayOffset = (startOfMonth.day() + 1) % 7;
    const daysInMonth = moment().daysInMonth();

    // Check for the correct number of empty days at the beginning
    for (let i = 0; i < startDayOffset; i++) {
      expect(calendarDays[i].date).toBe(0);
      expect(calendarDays[i].isToday).toBeFalse();
    }

    // Check for the correct days of the month
    for (let i = startDayOffset; i < startDayOffset + daysInMonth; i++) {
      const dayOfMonth = i - startDayOffset + 1;
      expect(calendarDays[i].date).toBe(dayOfMonth);
      expect(calendarDays[i].isToday).toBe(dayOfMonth === moment().date());
    }
  });

  it('should get the correct current month and year', () => {
    const currentDate = moment();
    const { month, year } = service.getCurrentMonthAndYear(currentDate);
    expect(month).toBe(currentDate.format('MMMM'));
    expect(year).toBe(currentDate.format('YYYY'));
  });

  it('should fill empty days with 0 and isToday as false', () => {
    service.calendarDays = [];
    (service as any).fillEmptyDays(3); // Calling the private method using type assertion

    expect(service.calendarDays.length).toBe(3);
    expect(
      service.calendarDays.every((day) => day.date === 0 && !day.isToday)
    ).toBeTrue();
  });

  it('should fill days of the month with correct dates and isToday flag', () => {
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    const today = moment();
    service.calendarDays = [];

    service['fillDaysOfMonth'](startOfMonth, endOfMonth, today);

    const daysInMonth = today.daysInMonth();
    expect(service.calendarDays.length).toBe(daysInMonth);
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.date();
      expect(service.calendarDays[day - 1].date).toBe(day);
      expect(service.calendarDays[day - 1].isToday).toBe(isToday);
    }
  });
});
