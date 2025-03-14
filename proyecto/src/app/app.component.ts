import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, MenuLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mi-Undersounds';
  showMenuLayout = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // Ocultar layout en páginas específicas
      //this.showMenuLayout = !['/login', '/register'].includes(this.router.url); --> Ejemplo de como ocultarlo en páginas
    });
  }
}
