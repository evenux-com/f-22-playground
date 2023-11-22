import { Component } from '@angular/core';
import { CalendarComponent } from '../../../projects/archangel-12-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-calendar-demo',
  imports: [CalendarComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarDemoComponent {}
