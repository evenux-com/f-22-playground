import { ComponentRef, Injectable, Renderer2, ViewContainerRef } from '@angular/core';
import { forkJoin, fromEvent, take } from 'rxjs';
import { LoaderComponent } from '../../public-api';

@Injectable({
  providedIn: 'root',
})
export class BootstrapService {
  private loaderRef!: ComponentRef<LoaderComponent>;

  constructor(
    private readonly renderer2: Renderer2,
    private readonly vcr: ViewContainerRef,
  ) {}

  public async loadApplication(): Promise<void> {
    const startTime = new Date().getTime();
    this.initializeLoader();
    await this.loadBackground(startTime);
  }

  private initializeLoader(): void {
    this.loaderRef = this.vcr.createComponent(LoaderComponent);
    this.loaderRef.instance.isPageLoader = true;
    this.loaderRef.instance.size = 42;
  }

  private async loadBackground(startTime: number): Promise<void> {
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
            const endTime = new Date().getTime();
            const timeDifference = endTime - startTime;

            const element = document.querySelector(':root') || false;
            if (!element) return;
            const computedStyle = window.getComputedStyle(element);
            const minTimeVarValue = computedStyle.getPropertyValue('--minimum-page-loading-time');
            const maxTime = +minTimeVarValue;
            let waitTime = 0;

            if (timeDifference < maxTime) {
              waitTime = maxTime - timeDifference;
            }

            setTimeout(() => {
              this.renderer2.addClass(mainElement, 'is-loaded');
              if (i === validUrls.length) {
                this.loaderRef.instance.isHidden = true;
                setTimeout(() => {
                  this.loaderRef.destroy();
                }, 666);
              }
            }, waitTime);
          });
      }

      bgImage.src = bgImageUrl;
      i++;
    }
  }
}
