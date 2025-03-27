import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoxContainerComponent } from '../../box-container/box-container.component';
import { StorageService } from '../../services/storage.service'; // ⬅ importa el servicio

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [BoxContainerComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';

  // Variables para los estados del usuario
  isArtist: boolean = false;
  isFan: boolean = false;
  isGuest: boolean = true; // Por defecto, el usuario es invitado
  users: any[] = [];

  // Definir emails y contraseñas predefinidos
  private usersDefault  = [
    { name: 'Admin Fan', username:'adminFan', email: 'fan@example.com', password: 'Fan1234@' },
    { name: 'Admin Artista', username:'adminArtista', email: 'artist@example.com', password: 'Artista1234@' }
  ];

  constructor(
    private router: Router,
    private storage: StorageService // Agrega StorageService
  ) {}

  login() {
    console.log("INICIANDO SESIÓN");

    // Recuperar lista de usuarios registrados
    this.users = JSON.parse(this.storage.getLocal('users') || '[]');

    // Buscar en usuarios por defecto
    const userD = this.usersDefault.find(u => u.email === this.email && u.password === this.password);

    if (userD) {
      // Usuario por defecto
      const currentUser = {
        name: userD.name,
        username: userD.username,
        email: userD.email,
        role: userD.email === 'fan@example.com' ? 'fan' : 'artist'
      };

      this.storage.setLocal('currentUser', JSON.stringify(currentUser));

      this.isFan = currentUser.role === 'fan';
      this.isArtist = currentUser.role === 'artist';
      this.isGuest = false;

      this.storage.setLocal('isFan', JSON.stringify(this.isFan));
      this.storage.setLocal('isArtist', JSON.stringify(this.isArtist));
      this.storage.setLocal('isGuest', JSON.stringify(this.isGuest));

      console.log(`Soy ${currentUser.role.toUpperCase()}`);
      alert('✅ Login exitoso');
      this.router.navigate(['/main-menu']);

    } else if (this.users.length > 0) {
      // Buscar usuario en la lista registrada
      const registeredUser = this.users.find(u => u.email === this.email && u.password === this.password);

      if (registeredUser) {
        // Usuario registrado manualmente
        const currentUser = {
          name: registeredUser.name,
          username: registeredUser.username,
          email: registeredUser.email,
          role: registeredUser.role
        };

        this.storage.setLocal('currentUser', JSON.stringify(currentUser));

        this.isFan = currentUser.role === 'fan';
        this.isArtist = currentUser.role === 'artist';
        this.isGuest = false;

        this.storage.setLocal('isFan', JSON.stringify(this.isFan));
        this.storage.setLocal('isArtist', JSON.stringify(this.isArtist));
        this.storage.setLocal('isGuest', JSON.stringify(this.isGuest));

        console.log(`Soy ${currentUser.role.toUpperCase()}`);
        alert('✅ Login exitoso');
        this.router.navigate(['/main-menu']);
      } else {
        // Usuario no encontrado en ninguna lista
        alert('⚠️ Email o contraseña incorrectos');
      }

    } else {
      alert('⚠️ Email o contraseña incorrectos');
    }
  }

  goBack(): void {
    this.router.navigate(['/main-menu']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
