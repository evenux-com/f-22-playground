import { AfterViewInit, Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { Navigation, Pagination } from 'swiper/modules';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Swiper from 'swiper';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'f-22-swiper',
  templateUrl: 'swiper.component.html',
  styleUrls: ['./swiper.component.scss'],
})
export class F22SwiperComponent implements AfterViewInit {
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

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSlideChange: EventEmitter<number> = new EventEmitter<number>();

  public swiper!: Swiper;
  public identifier!: string;

  private isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.identifier = this.generateRandomString(12);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ngAfterViewInit(): void {
    if (this.isBrowser) {
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

      this.swiper.on('slideChange', (swiper) => {
        this.onSlideChange.emit(swiper.activeIndex);
      });
    }
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
