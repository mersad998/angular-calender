import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

interface CalenderType {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css',
})
export class CalenderComponent {
  calenderTypes: CalenderType[] = [
    { value: '1', viewValue: 'شمسی' },
    { value: '2', viewValue: 'میلادی' },
  ];
}
