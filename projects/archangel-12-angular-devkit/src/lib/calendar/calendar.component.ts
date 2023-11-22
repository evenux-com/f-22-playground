import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'archangel-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() month: number = 1;
  @Input() year: number = 2024;
  @Input() startDayOfWeek: number = 1; // Default to Monday (0 is Sunday, 1 is Monday, and so on)

  weeks: number[][] = [];

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const firstDayOfMonth = new Date(this.year, this.month - 1, 1);
    const daysInMonth = new Date(this.year, this.month, 0).getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday, 1 is Monday, and so on

    let currentDay = 1;

    const daysUntilStart = (startingDayOfWeek - this.startDayOfWeek + 7) % 7;

    for (let i = 0; i < 6; i++) {
      const week: any[] = [];

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < daysUntilStart) {
          week.push(null); // Placeholder for days before the first of the month
        } else if (currentDay > daysInMonth) {
          week.push(null); // Placeholder for days after the last of the month
        } else {
          week.push(currentDay);
          currentDay++;
        }
      }

      const validDays = week.filter((d) => !!d).length;
      if (validDays > 0) {
        this.weeks.push(week);
      }
    }
  }
}
