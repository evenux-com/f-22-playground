import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ArchangelCheckboxComponent,
  ArchangelFormControlDirective,
  ArchangelRadiosComponent,
  ArchangelRangePickerComponent,
  ArchangelRangeSelectComponent,
} from '../../../projects/archangel-12-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-form-demo',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ArchangelFormControlDirective,
    ArchangelCheckboxComponent,
    ArchangelRadiosComponent,
    ArchangelRangeSelectComponent,
    ArchangelRangePickerComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormDemoComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public types: any[] = ['primary', 'secondary', 'black', 'transparent', 'disabled'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public radioOptions: any[] = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Disabled', disabled: true },
  ];
}
