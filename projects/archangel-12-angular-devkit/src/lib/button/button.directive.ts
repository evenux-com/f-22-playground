import { Directive, ElementRef, HostBinding, Inject, Input, OnChanges, PLATFORM_ID, SimpleChanges, ViewContainerRef } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[archangelButton]',
})
export class ArchangelButtonDirective implements OnChanges {
  @Input() small: boolean = false;
  @Input() border: boolean = false;
  @Input() rounded: boolean = false;
  @Input() color: 'primary' | 'secondary' | 'white' | 'black' | undefined;
  @Input() loading: boolean = false;
  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
  }

  @HostBinding('class.btn-disabled') isDisabled: boolean = false;
  @HostBinding('class') get classes(): string {
    const classes = ['btn'];

    if (this.small) {
      classes.push('btn-small');
    }

    if (this.border) {
      classes.push('btn-bordered');
    }

    if (this.rounded) {
      classes.push('btn-rounded');
    }

    if (this.color) {
      classes.push(`btn-${this.color}`);
    }

    return classes.join(' ');
  }

  private initialWidth: number = 0;
  private initialHeight: number = 0;
  private loaderSize: number = 11;
  private loaderGap: number = 10;

  private hasAddedLoader: boolean = false;
  private isBrowser: boolean = false;

  constructor(
    private readonly el: ElementRef,
    private readonly vcr: ViewContainerRef,
    @Inject(PLATFORM_ID) private platformId: NonNullable<unknown>,
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
    const host = this.el.nativeElement;

    // Store initial dimensions
    this.initialWidth = host.offsetWidth;
    this.initialHeight = host.offsetHeight;

    // Set initial width to begin animation of width
    host.style.width = this.initialWidth + 'px';
    host.style.height = this.initialHeight + 'px';

    setTimeout(() => {
      // Begin animation to increase button width to icon + margin width
      host.style.width = this.initialWidth + this.loaderSize + this.loaderGap + 'px';

      // Transfer text in a button to a relative span
      const text = document.createElement('span');
      text.textContent = host.innerText;
      host.innerText = '';

      // Ensure button height stays same
      host.style.height = this.initialHeight + 'px';
      host.appendChild(text);

      // Wait for DOM to render new span
      setTimeout(() => {
        // Get dynamic variable padding (margin) values
        const r = document.querySelector(':root');
        const rs = r ? getComputedStyle(r) : false;
        const paddingX = rs ? (!this.small ? rs.getPropertyValue('--lg-button-x-padding') : rs.getPropertyValue('--sm-button-x-padding')) : '0px';

        const paddingXNumber = Number(paddingX.slice(0, -2));

        // Offset (new) span element
        text.style.left = this.loaderGap + this.loaderSize + paddingXNumber + 'px';

        // Wait for span (offset) animation to finish
        setTimeout(() => {
          // Create loader component and set it's size
          const loaderRef = this.vcr.createComponent(LoaderComponent);
          loaderRef.instance.size = this.loaderSize;

          // Insert it into the button element in DOM
          host.insertBefore(loaderRef.location.nativeElement, host.firstChild);

          loaderRef.location.nativeElement.style.position = 'absolute';
          loaderRef.location.nativeElement.style.top = '3px'; // Magic number, just seems to work
          loaderRef.location.nativeElement.style.left = '0px';

          const loaderElement = loaderRef.location.nativeElement.querySelector('.loader');

          // Toggle off opacity (visibility)
          loaderElement.classList.add('loader-button-edition');
          loaderElement.classList.add(`loader-${this.color}`);

          // Wait for DOM to render
          setTimeout(() => {
            // Added faded-in class to begin "fade in" animation
            loaderElement.classList.add('loader-faded-in');

            // Wait for fade-in to complete
            setTimeout(() => {
              this.hasAddedLoader = true;
            }, 750);
          }, 100);
        }, 750);
      }, 100);
    }, 100);
  }

  private finalizeLoadingSequence(): void {
    const loaderRef = this.el.nativeElement.querySelector('archangel-loader');
    const loaderEl = this.el.nativeElement.querySelector('.loader');

    // Toggle off opacity (visibility)
    loaderEl.classList.remove('loader-faded-in');

    // Wait for fade out transition to finish
    setTimeout(() => {
      // Remove loader component from the DOM
      this.el.nativeElement.removeChild(loaderRef);

      // Get reference to span element
      const text = this.el.nativeElement.querySelector('span');

      // Get dynamic variable padding (margin) values
      const r = document.querySelector(':root');
      const rs = r ? getComputedStyle(r) : false;
      const paddingX = rs ? (!this.small ? rs.getPropertyValue('--lg-button-x-padding') : rs.getPropertyValue('--sm-button-x-padding')) : '0px';

      const paddingXNumber = Number(paddingX.slice(0, -2));

      // Offset (old) span element back to default position
      text.style.left = paddingXNumber + 'px';

      // Set back button to initial width
      this.el.nativeElement.style.width = this.initialWidth + 'px';

      // Wait for span position transition to finish
      setTimeout(() => {
        // Set back button innerText and remove span
        this.el.nativeElement.innerText = text.innerText;

        setTimeout(() => {
          this.hasAddedLoader = false;
        }, 750);
      }, 750);
    }, 750);
  }
}