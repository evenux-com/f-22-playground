import { Component } from '@angular/core';
import { ConfirmationService, F22ButtonComponent, NotificationService } from '../../../projects/f-22-angular-devkit/src/public-api';
import { take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-dialogs-demo',
  imports: [F22ButtonComponent],
  providers: [ConfirmationService, NotificationService],
  templateUrl: './dialogs.component.html',
  styleUrl: './dialogs.component.scss',
})
export class DialogsDemoComponent {
  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly notificationService: NotificationService,
  ) {}

  public openConfirmation(): void {
    const ref = this.confirmationService.show('This is a sample confirmation - do you agree?', 'Agree', 'Cancel');
    ref.componentInstance?.dialogRef.closed.pipe(take(1)).subscribe((result) => {
      this.notificationService.show(`You did ${result ? 'indeed' : 'not'} agree...`);
    });
  }

  public openNotification(): void {
    this.notificationService.show('This is a sample notification you can display...');
  }
}
