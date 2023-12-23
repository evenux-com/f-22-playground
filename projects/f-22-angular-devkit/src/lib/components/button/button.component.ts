import { Component, HostBinding, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'f-22-button',
  templateUrl: 'button.component.html',
  styleUrl: 'button.component.scss',
})
export class F22ButtonComponent {
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
    let innerText = '';
    if (this.isBrowser && isLoading && !this.hasAddedLoader) {
      innerText = this.beginLoadingSequence();
    } else if (this.isBrowser && !isLoading && this.hasAddedLoader) {
      this.finalizeLoadingSequence(innerText);
    }
  }
}
