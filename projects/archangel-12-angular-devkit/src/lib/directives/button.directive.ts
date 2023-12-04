import { Directive, ElementRef, HostBinding, Inject, Input, OnChanges, PLATFORM_ID, SimpleChanges, ViewContainerRef } from '@angular/core';
import { LoaderComponent } from '../components/loader/loader.component';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[archangelButton]',
})
export class ArchangelButtonDirective implements OnChanges {
  @Input() color: 'primary' | 'secondary' | 'white' | 'black' | undefined;
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() border: boolean = false;
  @Input() rounded: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() loading: boolean = false;
  @Input() loaderSize: number | null = null;

  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
  }

  @HostBinding('class.btn-disabled') isDisabled: boolean = false;
  @HostBinding('class') get classes(): string {
    const classes = ['btn'];
    classes.push(`btn-${this.size}`);

    if (this.border) {
      classes.push('btn-bordered');
    }

    if (this.rounded) {
      classes.push('btn-rounded');
    }

    if (this.fullWidth) {
      classes.push('btn-full-width');
    }

    if (this.color) {
      classes.push(`btn-${this.color}`);
    }

    return classes.join(' ');
  }

  private smallLoaderSize: number = 8;
  private mediumLoaderSize: number = 12;
  private largeLoaderSize: number = 16;

  private hasAddedLoader: boolean = false;
  private isBrowser: boolean = false;

  constructor(
    private readonly el: ElementRef,
    private readonly vcr: ViewContainerRef,
    @Inject(PLATFORM_ID) private readonly platformId: NonNullable<unknown>,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const isLoading = changes['loading'] && changes['loading'].currentValue;
    if (this.isBrowser && isLoading && !this.hasAddedLoader) {
      this.beginLoadingSequence();
    } else if (this.isBrowser && !isLoading && this.hasAddedLoader) {
      this.finalizeLoadingSequence();
    }
  }

  private beginLoadingSequence(): void {
    this.el.nativeElement.style.height = this.el.nativeElement.offsetHeight + 'px';
    const text = document.createElement('div');
    text.textContent = this.el.nativeElement.innerText;
    this.el.nativeElement.innerText = '';
    text.classList.add('content-wrapper');
    this.el.nativeElement.appendChild(text);

    setTimeout(() => {
      text.classList.add('faded-out');

      setTimeout(() => {
        const loaderRef = this.vcr.createComponent(LoaderComponent);
        if (this.size === 'small') {
          loaderRef.instance.size = this.smallLoaderSize;
        } else if (this.size === 'medium') {
          loaderRef.instance.size = this.mediumLoaderSize;
        } else if (this.size === 'large') {
          loaderRef.instance.size = this.largeLoaderSize;
        } else if (!this.loaderSize) {
          loaderRef.instance.size = this.mediumLoaderSize;
        }

        this.el.nativeElement.insertBefore(loaderRef.location.nativeElement, this.el.nativeElement.firstChild);
        const loaderElement = loaderRef.location.nativeElement.querySelector('.loader');
        loaderRef.instance.isHidden = true;
        loaderElement.classList.add(`loader-${this.color}`);

        setTimeout(() => {
          loaderElement.classList.add('loader-faded-in');
          setTimeout(() => (this.hasAddedLoader = true), 333);
        }, 333);
      }, 111);
    });
  }

  private finalizeLoadingSequence(): void {
    const loaderEl = this.el.nativeElement.querySelector('.loader');
    loaderEl.classList.remove('loader-faded-in');

    setTimeout(() => {
      const loaderRef = this.el.nativeElement.querySelector('archangel-loader');
      this.el.nativeElement.removeChild(loaderRef);

      const text = this.el.nativeElement.querySelector('.content-wrapper');
      text.classList.remove('faded-out');
      setTimeout(() => {
        this.el.nativeElement.innerText = text.innerText;
        setTimeout(() => (this.hasAddedLoader = false), 333);
      }, 333);
    }, 333);
  }
}
