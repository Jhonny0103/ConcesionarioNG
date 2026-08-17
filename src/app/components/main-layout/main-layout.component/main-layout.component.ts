import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component/navbar.component';

@Component({
  selector: 'app-main-layout.component',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {

}
