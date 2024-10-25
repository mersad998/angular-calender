import { GregorianCalendarService } from './gregorianCalendarService';
import { JalaliCalendarService } from './jalaliCalendarService';
import {
  CalendarServiceInterface,
  CalendarType,
} from '../calendar/calendar.component.types';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarServiceFactory {
  initializeService(
    type: CalendarType.Gregorian | CalendarType.Jalali
  ): CalendarServiceInterface {
    if (type === CalendarType.Gregorian) {
      return new GregorianCalendarService();
    } else if (type === CalendarType.Jalali) {
      return new JalaliCalendarService();
    } else {
      throw new Error('Invalid calendar type');
    }
  }
}
