import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isArtist: boolean = false;
  isFan: boolean = false;
  isGuest: boolean = true; // Por defecto, el usuario es invitado
  profilePictureUrl: string = 'assets/icons/profile.svg'; // valor por defecto
  constructor(private router: Router) {}

  ngOnInit() {
    // Cargar si el usuario es artista desde localStorage
    this.isArtist = JSON.parse(localStorage.getItem('isArtist') || 'false');
    // Cargar el estado de la sesión desde localStorage
    this.isGuest = JSON.parse(localStorage.getItem('isGuest') || 'false');
    // Cargar si el usuario es fan desde localStorage
    this.isFan = JSON.parse(localStorage.getItem('isFan') || 'false');

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      if (parsed.profilePicture) {
        this.profilePictureUrl = parsed.profilePicture;
      }
    }
  }

  useDefaultPicture(event: any) {
    event.target.src = 'assets/icons/profile.svg'; // si falla la imagen, usar por defecto
  }

  goToProfile() {
    if (this.isGuest) {
      this.router.navigate(['/login']); // Si es invitado, lo lleva al login
    } else {
      this.router.navigate(['/profile']); // Si tiene sesión iniciada, lo lleva al perfil
    }
  }

  goToViewDiscography(): void {
    this.router.navigate(['/view-discography']); // Lleva al artista a la discografía
  }

  goToCart(): void {
    if (!this.isGuest) {
      this.router.navigate(['/cart']); // Lleva al FAN o ARTISTA al carrito, pero NO al INVITADO
    }
    else {
      alert('⚠️ Debes ser un FAN o ARTISTA para acceder a esta sección.');
    }
  }

  goToSettings(): void {
    this.router.navigate(['/settings']); // Navega a la pantalla de ajustes en los 3 perfiles
  }
}
