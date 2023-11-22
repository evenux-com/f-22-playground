import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SelectComponent,
  ArchangelButtonDirective,
  NotificationService,
} from '../../../projects/archangel-12-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-selects-demo',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    ArchangelButtonDirective,
  ],
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
    { label: 'BMW', value: 1 },
    { label: 'Audi', value: 2 },
    { label: 'Porsche', value: 3 },
    { label: 'Ferrari', value: 4 },
    { label: 'Toyota', value: 5 },
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
    private readonly notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    this.form.controls.selection.valueChanges.subscribe((value) => {
      this.selectedOption3Value = !!value;
      this.selectedOption3 = this.options3.find(
        (o) => o.value === this.selectedOption3Value
      );
    });
  }

  public onSelectOption1(): void {
    this.selectedOption1 = this.options1.find(
      (o) => o.value === this.selectedOption1Value
    );
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
      'Options have been successfully shuffled. This goes to demonstrate that all options in the array can be modified/changed and update in real time!'
    );
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffledArray = array.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    return shuffledArray;
  }
}
