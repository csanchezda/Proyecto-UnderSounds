import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Ajusta el path si necesario

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isArtist: boolean = false;
  isFan: boolean = false;
  isGuest: boolean = true; // Por defecto es invitado
  profilePictureUrl: string = 'assets/icons/profile.svg';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.isGuest = true;
      return;
  
    }

    this.authService.getUserProfile().then(user => {
      this.isArtist = user.isArtist;
      this.isFan = !user.isArtist;
      this.isGuest = false;
      if (user.profilePicture && user.profilePicture.startsWith('http')) {
        this.profilePictureUrl = user.profilePicture;
      }
          }).catch(error => {
      console.error('⚠️ Error al cargar perfil en Header:', error);
      this.isGuest = true;
    });
    
  }

  useDefaultPicture(event: any): void {
    const fallback = 'assets/icons/profile.svg';
    const currentSrc = event?.target?.src || '';
  
    if (!currentSrc.includes(fallback)) {
      event.target.src = fallback;
    }
  }
  
  

goToProfile(): void {
  if (this.isGuest) {
    this.router.navigate(['/login']);
  } else if (this.router.url !== '/profile') {
    this.router.navigate(['/profile']);
  }
}

  goToViewDiscography(): void {
    this.router.navigate(['/view-discography']);
  }

  goToCart(): void {
    if (!this.isGuest) {
      this.router.navigate(['/cart']);
    } else {
      alert('⚠️ Debes ser un FAN o ARTISTA para acceder a esta sección.');
    }
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
