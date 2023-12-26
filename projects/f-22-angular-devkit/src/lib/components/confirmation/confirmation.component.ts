import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { F22ButtonComponent } from '../button/button.component';

@Component({
  standalone: true,
  imports: [F22ButtonComponent],
  selector: 'f-22-confirmation',
  templateUrl: 'confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(DIALOG_DATA) public data: any,
    public dialogRef: DialogRef<boolean>,
  ) {}
}
