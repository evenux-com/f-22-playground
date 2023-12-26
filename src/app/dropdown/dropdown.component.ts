import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  F22DropdownTriggerForDirective,
  F22ButtonComponent,
  F22DropdownComponent,
} from '../../../projects/f-22-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-dropdown-demo',
  imports: [FormsModule, ReactiveFormsModule, F22ButtonComponent, F22DropdownComponent, F22DropdownTriggerForDirective],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownDemoComponent {}
