import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import this
import { CalendarComponent } from './calendar.component';
import { CalendarServiceFactory } from '../services/calendarServiceFactory';
import {
  CalendarType,
  CalendarServiceInterface,
} from './calendar.component.types';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import moment from 'moment';

describe('CalendarComponent ', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let mockCalendarService: CalendarServiceInterface;
  let mockCalendarServiceFactory: { initializeService: jasmine.Spy };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent, BrowserAnimationsModule],
    }).compileComponents();

    // Create a mock CalendarService with spy functions
    mockCalendarService = {
      initializeDate: jasmine
        .createSpy('initializeDate')
        .and.returnValue(moment()),
      getCurrentMonthAndYear: jasmine
        .createSpy('getCurrentMonthAndYear')
        .and.returnValue({ month: 'January', year: '2024' }),
      generateCalendarDays: jasmine
        .createSpy('generateCalendarDays')
        .and.returnValue([{ date: 1, isToday: false }]),
      latinToPersianNumber: jasmine
        .createSpy('latinToPersianNumber')
        .and.callFake((day: number) => day.toString()),
      weekDays: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      calendarDirection: 'ltr',
      previousMonthIconName: 'arrow_back',
      nextMonthIconName: 'arrow_forward',
      previousMonthText: 'Previous',
      nextMonthText: 'Next',
      getEndOfMonth: () => moment(),
      getStartOfMonth: () => moment(),
    };

    // Provide mock factory
    mockCalendarServiceFactory = {
      initializeService: jasmine
        .createSpy('initializeService')
        .and.returnValue(mockCalendarService),
    };

    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [
        {
          provide: CalendarServiceFactory,
          useValue: mockCalendarServiceFactory,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default calendar type as Gregorian', () => {
    expect(component.selectedCalendarType).toEqual(CalendarType.Gregorian);
    expect(mockCalendarServiceFactory.initializeService).toHaveBeenCalledWith(
      CalendarType.Gregorian
    );
  });

  it('should update calendar service on calendar type change', () => {
    component.onCalendarTypeChange({ value: CalendarType.Jalali });
    expect(mockCalendarServiceFactory.initializeService).toHaveBeenCalledWith(
      CalendarType.Jalali
    );
  });

  it('should update the current date on init', () => {
    expect(mockCalendarService.initializeDate).toHaveBeenCalled();
  });

  it('should update calendar days and headers when navigating to the next month', () => {
    component.goToNextMonth();
    expect(mockCalendarService.getCurrentMonthAndYear).toHaveBeenCalledWith(
      component.currentDate
    );
    expect(mockCalendarService.generateCalendarDays).toHaveBeenCalledWith(
      component.currentDate
    );
  });

  it('should update calendar days and headers when navigating to the previous month', () => {
    component.goToPreviousMonth();
    expect(mockCalendarService.getCurrentMonthAndYear).toHaveBeenCalledWith(
      component.currentDate
    );
    expect(mockCalendarService.generateCalendarDays).toHaveBeenCalledWith(
      component.currentDate
    );
  });

  it('should correctly fetch localized day text', () => {
    const dayText = component.getLocalizedDayText(5);
    expect(dayText).toEqual('5');
  });

  it('should render week days based on the service provided', () => {
    fixture.detectChanges();
    const weekDaysElements = fixture.debugElement.queryAll(
      By.css('.font-bold.text-center')
    );
    expect(weekDaysElements.length).toBe(7);
    weekDaysElements.forEach((el: DebugElement, index: number) => {
      expect(el.nativeElement.textContent.trim()).toBe(
        mockCalendarService.weekDays[index]
      );
    });
  });

  it('should render calendar days from the generated days', () => {
    fixture.detectChanges();
    const calendarDaysElements = fixture.debugElement.queryAll(
      By.css('.border.p-2.text-center')
    );
    expect(calendarDaysElements.length).toBe(1);
    expect(calendarDaysElements[0].nativeElement.textContent.trim()).toBe('1');
  });
});
