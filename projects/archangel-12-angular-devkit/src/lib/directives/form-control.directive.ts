import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[archangelFormControl]',
})
export class ArchangelFormControlDirective implements OnInit {
  @Input() background: 'primary' | 'secondary' | 'white' | 'black' | 'transparent' = 'primary';
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() centered: boolean = false;
  @Input() border: boolean = false;
  @Input() rounded: boolean = false;
  @Input() fullWidth: boolean = false;

  @Input() set disabled(value: boolean) {
    this.isDisabled = value;
  }

  @HostBinding('class.form-control-disabled') isDisabled: boolean = false;
  @HostBinding('class') get classes(): string {
    const classes = ['form-control'];
    classes.push(`form-control-${this.size}`);

    if (this.centered) {
      classes.push('form-control-centered');
    }

    if (this.border) {
      classes.push('form-control-bordered');
    }

    if (this.rounded) {
      classes.push('form-control-rounded');
    }

    if (this.fullWidth) {
      classes.push('form-control-full-width');
    }

    if (this.background) {
      classes.push(`form-control-background-${this.background}`);
    }

    return classes.join(' ');
  }

  constructor(
    private readonly el: ElementRef,
    private readonly renderer2: Renderer2,
  ) {}

  public ngOnInit(): void {
    if (this.isDisabled) {
      this.renderer2.setProperty(this.el.nativeElement, 'disabled', true);
    }
  }
}
