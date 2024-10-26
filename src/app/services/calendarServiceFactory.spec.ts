import { TestBed } from '@angular/core/testing';
import { CalendarServiceFactory } from './calendarServiceFactory';
import { GregorianCalendarService } from './gregorianCalendarService';
import { JalaliCalendarService } from './jalaliCalendarService';
import { CalendarType } from '../calendar/calendar.component.types';

describe('CalendarServiceFactory', () => {
  let factory: CalendarServiceFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarServiceFactory],
    });
    factory = TestBed.inject(CalendarServiceFactory);
  });

  it('should create an instance of CalendarServiceFactory', () => {
    expect(factory).toBeTruthy();
  });

  it('should return an instance of GregorianCalendarService when type is Gregorian', () => {
    const service = factory.initializeService(CalendarType.Gregorian);
    expect(service).toBeInstanceOf(GregorianCalendarService);
  });

  it('should return an instance of JalaliCalendarService when type is Jalali', () => {
    const service = factory.initializeService(CalendarType.Jalali);
    expect(service).toBeInstanceOf(JalaliCalendarService);
  });

  it('should throw an error when an invalid calendar type is passed', () => {
    expect(() =>
      factory.initializeService('InvalidType' as CalendarType)
    ).toThrowError('Invalid calendar type');
  });
});
