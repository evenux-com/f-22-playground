import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { F22ButtonDirective } from '../../directives/button.directive';

@Component({
  standalone: true,
  imports: [F22ButtonDirective],
  selector: 'f-22-notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(DIALOG_DATA) public data: any,
    public dialogRef: DialogRef<void>,
  ) {}
}
