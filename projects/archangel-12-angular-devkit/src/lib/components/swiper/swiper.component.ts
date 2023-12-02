import { AfterViewInit, Component, Input } from '@angular/core';
import { Navigation, Pagination } from 'swiper/modules';
import Swiper from 'swiper';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'archangel-swiper',
  templateUrl: 'swiper.component.html',
  styleUrls: ['./swiper.component.scss'],
})
export class ArchangelSwiperComponent implements AfterViewInit {
  @Input() borderRadius: number = 20;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() config: any = {
    slidesPerView: 1,
    spaceBetween: 40,
    direction: 'horizontal',
    loop: false,
    pagination: {
      enabled: false,
    },
    navigation: {
      enabled: false,
    },
  };

  public swiper!: Swiper;
  public identifier!: string;

  constructor() {
    this.identifier = this.generateRandomString(12);
  }

  public ngAfterViewInit(): void {
    this.swiper = new Swiper(`.${this.identifier}`, {
      modules: [Navigation, Pagination],
      ...this.config,
      slidesPerView: this.config?.slidesPerView || 1,
      spaceBetween: this.config?.spaceBetween || 40,
      direction: this.config?.direction || 'horizontal',
      loop: this.config?.loop || false,
      pagination: {
        el: '.swiper-pagination',
        enabled: this.config?.pagination?.enabled || false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        enabled: this.config?.navigation?.enabled || false,
      },
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

  private generateRandomString(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
}