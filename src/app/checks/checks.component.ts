import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F22CheckboxComponent, F22FormControlDirective, F22RadiosComponent } from '../../../projects/f-22-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-checks-demo',
  imports: [FormsModule, ReactiveFormsModule, F22FormControlDirective, F22CheckboxComponent, F22RadiosComponent],
  templateUrl: './checks.component.html',
  styleUrl: './checks.component.scss',
})
export class ChecksDemoComponent implements OnInit {
  public checkbox1: boolean = false;
  public checkbox2: boolean = false;
  public checkbox3: boolean = false;

  public radio1: number = 1;

  public form = this.fb.group({
    checkbox1: [false],
    checkbox2: [false],
    checkbox3: [false],
    switch1: [false],
    switch2: [false],
    switch3: [false],
    radio2: [1],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public radioOptionsLg: any[] = [
    { label: 'Large 1', value: 1 },
    { label: 'Large 2', value: 2 },
    { label: 'Disabled', disabled: true },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public radioOptionsMd: any[] = [
    { label: 'Medium 1', value: 1 },
    { label: 'Medium 2', value: 2 },
    { label: 'Disabled', disabled: true },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public radioOptionsSm: any[] = [
    { label: 'Small 1', value: 1 },
    { label: 'Small 2', value: 2 },
    { label: 'Disabled', disabled: true },
  ];

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
