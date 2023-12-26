import { Component, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { DropdownPanel } from '../../interfaces/dropdown-panel.interface';

@Component({
  standalone: true,
  selector: 'f-22-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class F22DropdownComponent implements DropdownPanel {
  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;
  @Output() closed = new EventEmitter<void>();
}
