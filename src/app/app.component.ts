import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ButtonsDemoComponent } from './buttons/buttons.component';
import { SelectsDemoComponent } from './selects/selects.component';
import { DialogsDemoComponent } from './dialogs/dialogs.component';
import { CalendarDemoComponent } from './calendar/calendar.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    ButtonsDemoComponent,
    SelectsDemoComponent,
    DialogsDemoComponent,
    CalendarDemoComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
