import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'archangel-loader',
  templateUrl: 'loader.component.html',
  styleUrl: 'loader.component.scss',
})
export class LoaderComponent {
  @Input() size: number = 16;
}
