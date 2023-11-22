import { Component } from '@angular/core';
import {
  ArchangelButtonDirective,
  LoaderComponent,
} from '../../../projects/archangel-12-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-buttons-demo',
  imports: [ArchangelButtonDirective, LoaderComponent],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
})
export class ButtonsDemoComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public buttons1: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public buttons2: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public buttons3: any[] = [];

  constructor() {
    const colors = ['primary', 'secondary', 'black'];
    for (const color of colors) {
      this.buttons1.push({
        color: color,
        loading: false,
      });
    }

    for (const color of colors) {
      this.buttons2.push({
        color: color,
        loading: false,
      });
    }

    for (const color of colors) {
      this.buttons3.push({
        color: color,
        loading: false,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public simulateAction(button: any): void {
    if (!button.loading) {
      button.loading = true;
      clearTimeout(button.timeout);
      button.timeout = setTimeout(() => {
        button.loading = false;
      }, 3000);
    }
  }
}
