import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationLayoutComponent } from '../navigation-layout/navigation-layout.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-menu-layout',
  imports: [RouterModule, NavigationLayoutComponent, FooterComponent],
  templateUrl: './menu-layout.component.html',
  styleUrl: './menu-layout.component.css'
})
export class MenuLayoutComponent {

}
