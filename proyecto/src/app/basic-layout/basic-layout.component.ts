import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../navigation-layout/header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-basic-layout',
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './basic-layout.component.html',
  styleUrl: './basic-layout.component.css'
})
export class BasicLayoutComponent {

}
