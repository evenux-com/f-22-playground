import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { F22FormControlDirective } from '../../../projects/f-22-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-inputs-demo',
  imports: [FormsModule, ReactiveFormsModule, F22FormControlDirective],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.scss',
})
export class InputsDemoComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public types: any[] = ['primary', 'secondary', 'black', 'transparent', 'disabled'];

  public textInputs: string[] = [];

  public form: FormGroup = this.fb.group({
    textarea1: ['', Validators.required],
    textarea2: ['', Validators.required],
    textarea3: ['', Validators.required],
    textarea4: ['', Validators.required],
  });

  constructor(private readonly fb: FormBuilder) {}

  public ngOnInit(): void {
    this.form.valueChanges.subscribe((values) => {
      console.log(values);
    });
  }

  public debugLog(idx: number): void {
    console.log(`${idx}: ${this.textInputs[idx]}`);
  }
}
