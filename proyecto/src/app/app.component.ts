import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { app, analytics } from './firebase-config'; // Asegúrate de que la ruta sea correcta


@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mi-Undersounds';
  showMenuLayout = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Ocultar el diseño en páginas específicas
        // Ejemplo: Ocultarlo en las páginas '/login' y '/register'
        this.showMenuLayout = !['/login', '/register'].includes(event.url);
      }
    });
  }
}
