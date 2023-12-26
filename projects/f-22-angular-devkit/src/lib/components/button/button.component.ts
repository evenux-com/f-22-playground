import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { F22LoaderComponent } from '../loader/loader.component';

@Component({
  standalone: true,
  selector: 'f-22-button',
  imports: [F22LoaderComponent],
  templateUrl: 'button.component.html',
  styleUrl: 'button.component.scss',
  inputs: ['F22DropdownTriggerFor'],
})
export class F22ButtonComponent implements AfterViewInit {
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

  @HostBinding('style.width.px')
  hostWidth!: number;

  @HostBinding('style.height.px')
  hostHeight!: number;

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

  public isAnimationInProgress: boolean = true;
  public showContents: boolean = true;
  public showLoader: boolean = false;

  private isBrowser: boolean = false;

  constructor(
    private readonly el: ElementRef,
    private readonly cdRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private readonly platformId: NonNullable<unknown>,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public ngAfterViewInit(): void {
    this.hostWidth = this.el.nativeElement.offsetWidth + 1;
    this.hostHeight = this.el.nativeElement.offsetHeight;

    this.cdRef.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.isBrowser) {
      return;
    }

    const isLoading = changes['loading'] && changes['loading'].currentValue;
    if (isLoading) {
      setTimeout(() => {
        this.showContents = false;

        setTimeout(() => {
          this.isAnimationInProgress = false;

          setTimeout(() => {
            this.showLoader = true;
          }, 300);
        }, 650);
      });
    } else {
      this.showLoader = false;

      setTimeout(() => {
        this.isAnimationInProgress = true;

        setTimeout(() => {
          this.showContents = true;
        });
      }, 650);
    }
  }
}
