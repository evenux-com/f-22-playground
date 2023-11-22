import { Component } from '@angular/core';
import {
  ArchangelButtonDirective,
  ConfirmationService,
  NotificationService,
} from '../../../projects/archangel-12-angular-devkit/src/public-api';
import { take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-dialogs-demo',
  imports: [ArchangelButtonDirective],
  providers: [ConfirmationService, NotificationService],
  templateUrl: './dialogs.component.html',
  styleUrl: './dialogs.component.scss',
})
export class DialogsDemoComponent {
  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly notificationService: NotificationService
  ) {}

  public openConfirmation(): void {
    const ref = this.confirmationService.show(
      'This is a sample confirmation - do you agree?',
      'Agree',
      'Cancel'
    );
    ref.componentInstance?.dialogRef.closed
      .pipe(take(1))
      .subscribe((result) => {
        this.notificationService.show(
          `You did ${result ? 'indeed' : 'not'} agree...`
        );
      });
  }

  public openNotification(): void {
    this.notificationService.show(
      'This is a sample notification you can display...'
    );
  }
}
