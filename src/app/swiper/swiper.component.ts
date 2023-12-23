import { Component } from '@angular/core';
import { F22SwiperComponent } from '../../../projects/f-22-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-swiper-demo',
  imports: [F22SwiperComponent],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
})
export class SwiperDemoComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public bigSwiperConfig: any = {
    slidesPerView: 1,
    pagination: {
      enabled: true,
    },
    navigation: {
      enabled: true,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public smallSwiperConfig: any = {
    slidesPerView: 1,
    navigation: {
      enabled: true,
    },
    breakpoints: {
      1380: {
        slidesPerView: 4,
      },
    },
  };

  public debugLog(idx: number): void {
    console.log(idx);
  }
}
