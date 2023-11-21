import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  standalone: true,
  selector: 'archangel-notification',
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
