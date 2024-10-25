import { Component, Injectable, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import moment from 'moment';
import momentJalaali from 'moment-jalaali';
import { CommonModule } from '@angular/common';
import {
  jalaliMonthTranslations,
  jalaliWeekDays,
  gregorianWeekDays,
} from '../calendar/calendar.component.helpers';
import {
  type CalendarDay,
  type CalendarTypeOption,
  CalendarServiceInterface,
  CalendarType,
} from '../calendar/calendar.component.types';

@Injectable({
  providedIn: 'root',
})
export class GregorianCalendarService implements CalendarServiceInterface {
  getTest(): string {
    return 'hello from GregorianCalendarService';
  }
}
