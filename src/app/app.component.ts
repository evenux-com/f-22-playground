import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { SelectsComponent } from './selects/selects.component';
import { DialogsComponent } from './dialogs/dialogs.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    ButtonsComponent,
    SelectsComponent,
    DialogsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
