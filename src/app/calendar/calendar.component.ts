import { Component } from '@angular/core';
import { CalendarComponent } from '../../../projects/archangel-12-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-calendar-demo',
  imports: [CalendarComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarDemoComponent {
  public month: number = new Date().getMonth() + 1;
  public year: number = new Date().getFullYear();
}
