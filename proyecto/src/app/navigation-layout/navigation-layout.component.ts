import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SubheaderComponent } from './subheader/subheader.component';

@Component({
  selector: 'app-navigation-layout',
  imports: [HeaderComponent, SubheaderComponent],
  templateUrl: './navigation-layout.component.html',
  styleUrl: './navigation-layout.component.css'
})
export class NavigationLayoutComponent {

}
