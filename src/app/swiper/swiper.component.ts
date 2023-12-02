import { Component } from '@angular/core';
import { ArchangelSwiperComponent } from '../../../projects/archangel-12-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-swiper-demo',
  imports: [ArchangelSwiperComponent],
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
    slidesPerView: 4,
    navigation: {
      enabled: true,
    },
  };
}