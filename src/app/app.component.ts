import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ButtonsDemoComponent } from './buttons/buttons.component';
import { SelectsDemoComponent } from './selects/selects.component';
import { InputsDemoComponent } from './inputs/inputs.component';
import { ChecksDemoComponent } from './checks/checks.component';
import { RangesDemoComponent } from './ranges/ranges.component';
import { SwiperDemoComponent } from './swiper/swiper.component';
import { DialogsDemoComponent } from './dialogs/dialogs.component';
import { CalendarDemoComponent } from './calendar/calendar.component';
import { BootstrapService } from '../../projects/f-22-angular-devkit/src/public-api';
import { IconsDemoComponent } from './icons/icons.component';
import { DropdownDemoComponent } from './dropdown/dropdown.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    ButtonsDemoComponent,
    SelectsDemoComponent,
    InputsDemoComponent,
    ChecksDemoComponent,
    RangesDemoComponent,
    SwiperDemoComponent,
    DialogsDemoComponent,
    DropdownDemoComponent,
    CalendarDemoComponent,
    IconsDemoComponent,
  ],
  providers: [BootstrapService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private readonly bootstrapService: BootstrapService) {}

  public async ngOnInit(): Promise<void> {
    await this.bootstrapService.loadApplication();
  }
}
