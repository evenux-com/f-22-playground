import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ButtonsDemoComponent } from './buttons/buttons.component';
import { SelectsDemoComponent } from './selects/selects.component';
import { FormDemoComponent } from './form/form.component';
import { SwiperDemoComponent } from './swiper/swiper.component';
import { DialogsDemoComponent } from './dialogs/dialogs.component';
import { CalendarDemoComponent } from './calendar/calendar.component';
import { BootstrapService } from '../../projects/archangel-12-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    ButtonsDemoComponent,
    SelectsDemoComponent,
    FormDemoComponent,
    SwiperDemoComponent,
    DialogsDemoComponent,
    CalendarDemoComponent,
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
