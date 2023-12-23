import { Component } from '@angular/core';
import { F22ButtonDirective, LoaderComponent } from '../../../projects/f-22-angular-devkit/src/public-api';

@Component({
  standalone: true,
  selector: 'app-buttons-demo',
  imports: [F22ButtonDirective, LoaderComponent],
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

  public b1Loading: boolean = false;
  public b2Loading: boolean = false;
  public b3Loading: boolean = false;

  constructor() {
    const colors = ['primary', 'secondary', 'black', 'transparent', 'disabled'];
    let i = 1;

    for (const color of colors) {
      const button = {
        color: color,
        loading: false,
        disabled: i === 5,
      };

      this.buttons1.push({ ...button });
      this.buttons2.push({ ...button });
      this.buttons3.push({ ...button });
      i++;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public simulateAction(button: any): void {
    if (!button.disabled && !button.loading) {
      button.loading = true;
      clearTimeout(button.timeout);
      button.timeout = setTimeout(() => {
        button.loading = false;
      }, 3000);
    }
  }

  public simulateActionV1(): void {
    if (!this.b1Loading) {
      this.b1Loading = true;
      setTimeout(() => (this.b1Loading = false), 3000);
    }
  }

  public simulateActionV2(): void {
    if (!this.b2Loading) {
      this.b2Loading = true;
      setTimeout(() => (this.b2Loading = false), 3000);
    }
  }

  public simulateActionV3(): void {
    if (!this.b3Loading) {
      this.b3Loading = true;
      setTimeout(() => (this.b3Loading = false), 3000);
    }
  }
}
