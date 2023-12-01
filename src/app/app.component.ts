import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ButtonsDemoComponent } from './buttons/buttons.component';
import { SelectsDemoComponent } from './selects/selects.component';
import { FormDemoComponent } from './form/form.component';
import { SwiperDemoComponent } from './swiper/swiper.component';
import { DialogsDemoComponent } from './dialogs/dialogs.component';
import { CalendarDemoComponent } from './calendar/calendar.component';
import { forkJoin, fromEvent, take } from 'rxjs';

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
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  constructor(private readonly renderer2: Renderer2) {}

  public async ngAfterViewInit(): Promise<void> {
    const element = document.querySelector(':root') || false;
    if (!element) return;
    const computedStyle = window.getComputedStyle(element);
    const backgroundVarValue = computedStyle.getPropertyValue('--background-image');
    const urlRegex = /\((.*?)\)/g;
    const matches = backgroundVarValue.match(urlRegex);
    const images = matches ? matches.map((match) => match.slice(1, -1)) : [];
    const responses = await Promise.all(images.map((image) => fetch(`${window.location.protocol}//${window.location.host}${image}`)));

    const validUrls = [];
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const url = images[i];

      if (response.status !== 404) {
        validUrls.push(url);
      }
    }

    const observables = [];
    let i = 0;
    for (const image of validUrls) {
      const bgImageUrl = `${window.location.protocol}//${window.location.host}${image}`;
      const bgImage = new Image();
      observables.push(fromEvent(bgImage, 'load').pipe(take(1)));
      if (i === validUrls.length - 1) {
        forkJoin(observables)
          .pipe(take(1))
          .subscribe(() => {
            const mainElement = document.querySelector('main');
            this.renderer2.setStyle(mainElement, 'background-image', backgroundVarValue);
            this.renderer2.addClass(mainElement, 'is-loaded');
          });
      }

      bgImage.src = bgImageUrl;
      i++;
    }
  }
}
