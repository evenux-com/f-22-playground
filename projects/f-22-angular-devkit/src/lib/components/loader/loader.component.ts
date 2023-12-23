import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'f-22-loader',
  templateUrl: 'loader.component.html',
  styleUrl: 'loader.component.scss',
})
export class LoaderComponent {
  @Input() size: number = 16;
  @Input() isHidden: boolean = false;
  @Input() isPageLoader: boolean = false;
  @Input() loading: boolean = true;
}
