import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'archangel-range-picker',
  templateUrl: 'range-picker.component.html',
  styleUrls: ['./range-picker.component.scss'],
})
export class ArchangelRangePickerComponent {
  @Input() valueA: number = 0;
  @Input() valueB: number = 0;
  @Input() minValue: number = 0;
  @Input() maxValue: number = 100;
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() tickCount: number = 5;
  @Input() suffix: string = '';
  @Input() ticks: boolean = true;
  @Input() label: boolean = true;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onValueChange: EventEmitter<number> = new EventEmitter<number>();

  get textValueA(): string {
    return this.valueA.toString();
  }

  get textValueB(): string {
    return this.valueB.toString();
  }

  public updateRangeValueA(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueA = +target.value;
  }

  public updateRangeValueB(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueB = +target.value;
  }

  public onStateChange(): void {
    this.onValueChange.emit(this.min);
  }
}
