import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CalenderComponent } from './calender/calender.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalenderComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-calendar';
}
