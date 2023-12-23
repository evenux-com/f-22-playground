import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent, F22ButtonDirective, NotificationService } from '../../../projects/f-22-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-selects-demo',
  imports: [FormsModule, ReactiveFormsModule, SelectComponent, F22ButtonDirective],
  providers: [NotificationService],
  templateUrl: './selects.component.html',
  styleUrl: './selects.component.scss',
})
export class SelectsDemoComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public selectedOption1!: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public selectedOption2!: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public selectedOption3!: any;

  public selectedOption1Value!: number;
  public selectedOption2Value!: number;
  public selectedOption3Value!: boolean;

  public options1: { label: string; value: number }[] = [
    { label: 'Acura', value: 1 },
    { label: 'Alfa Romeo', value: 2 },
    { label: 'Aston Martin', value: 3 },
    { label: 'Audi', value: 4 },
    { label: 'Bentley', value: 5 },
    { label: 'BMW', value: 6 },
    { label: 'Buick', value: 7 },
    { label: 'Cadillac', value: 8 },
    { label: 'Chevrolet', value: 9 },
    { label: 'Chrysler', value: 10 },
    { label: 'Dodge', value: 11 },
    { label: 'Ferrari', value: 12 },
    { label: 'Fiat', value: 13 },
    { label: 'Ford', value: 14 },
    { label: 'Genesis', value: 15 },
    { label: 'GMC', value: 16 },
    { label: 'Honda', value: 17 },
    { label: 'Hyundai', value: 18 },
    { label: 'Infiniti', value: 19 },
    { label: 'Jaguar', value: 20 },
    { label: 'Jeep', value: 21 },
    { label: 'Kia', value: 22 },
    { label: 'Lamborghini', value: 23 },
    { label: 'Land Rover', value: 24 },
    { label: 'Lexus', value: 25 },
    { label: 'Lincoln', value: 26 },
    { label: 'Lotus', value: 27 },
    { label: 'Maserati', value: 28 },
    { label: 'Mazda', value: 29 },
    { label: 'McLaren', value: 30 },
    { label: 'Mercedes-Benz', value: 31 },
    { label: 'MINI', value: 32 },
    { label: 'Mitsubishi', value: 33 },
    { label: 'Nissan', value: 34 },
    { label: 'Porsche', value: 35 },
    { label: 'Ram', value: 36 },
    { label: 'Rolls-Royce', value: 37 },
    { label: 'Subaru', value: 38 },
    { label: 'Tesla', value: 39 },
    { label: 'Toyota', value: 40 },
    { label: 'Volkswagen', value: 41 },
    { label: 'Volvo', value: 42 },
  ];

  public options2: { label: string; value: number }[] = [
    { label: 'Red', value: 1 },
    { label: 'Blue', value: 2 },
    { label: 'Green', value: 3 },
    { label: 'Yellow', value: 4 },
    { label: 'Purple', value: 5 },
  ];

  public options3: { label: string; value: boolean; disabled?: boolean }[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
    { label: 'Disabled', value: false, disabled: true },
  ];

  public form = this.fb.group({
    selection: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly notificationService: NotificationService,
  ) {}

  public ngOnInit(): void {
    this.form.controls.selection.valueChanges.subscribe((value) => {
      this.selectedOption3Value = !!value;
      this.selectedOption3 = this.options3.find((o) => o.value === this.selectedOption3Value);
    });
  }

  public onSelectOption1(): void {
    this.selectedOption1 = this.options1.find((o) => o.value === this.selectedOption1Value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onSelectOption2(value: any): void {
    this.selectedOption2Value = value;
    this.selectedOption2 = this.options2.find((o) => o.value === value);
  }

  public shuffleOptions(): void {
    this.options1 = this.shuffle(this.options1);
    this.options2 = this.shuffle(this.options2);

    this.notificationService.show(
      'Options have been successfully shuffled. This goes to demonstrate that all options in the array can be modified/changed and update in real time!',
    );
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffledArray = array.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
  }
}
