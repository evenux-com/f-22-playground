import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchangelRangePickerComponent, ArchangelRangeSelectComponent } from '../../../projects/archangel-12-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-ranges-demo',
  imports: [FormsModule, ReactiveFormsModule, ArchangelRangeSelectComponent, ArchangelRangePickerComponent],
  templateUrl: './ranges.component.html',
  styleUrl: './ranges.component.scss',
})
export class RangesDemoComponent implements OnInit {
  public rangeSelect1: number = 50;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public rangePicker1: any = { a: 0, b: 50 };

  public form: FormGroup = this.fb.group({
    rangeSelect2: [50],
    rangePicker2: [{ a: 0, b: 50 }],
  });

  constructor(private readonly fb: FormBuilder) {}

  public ngOnInit(): void {
    this.form.valueChanges.subscribe((values) => {
      console.log(values);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debugLog(value: any): void {
    console.log(value);
  }
}
