import { Component, signal } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import {BrandsComponent} from './pages/brands/brands.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BrandsComponent],
  template: '<app-brands></app-brands>',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ConcesionarioNG');
}
