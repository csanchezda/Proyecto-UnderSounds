import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoxContainerComponent } from '../../box-container/box-container.component';

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

  // Definir emails y contraseñas predefinidos
  private users = [
    { name: 'Admin Fan', username:'adminFan', email: 'fan@example.com', password: 'Fan1234@' },
    { name: 'Admin Artista', username:'adminArtista', email: 'artist@example.com', password: 'Artista1234@' }
  ];

  constructor(private router: Router) {}

  login() {
    console.log("INICIANDO SESIÓN");

    const user = this.users.find(u => u.email === this.email && u.password === this.password);

    if (user) {
        // Guardar los datos del usuario en localStorage
        const currentUser = {
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.email === 'fan@example.com' ? 'fan' : 'artist'
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Definir el tipo de usuario
        if (currentUser.role === 'fan') {
            this.isFan = true;
            this.isArtist = false;
            console.log("Soy FAN POR DEFECTO");
        } else {
            this.isArtist = true;
            this.isFan = false;
            console.log("Soy ARTISTA POR DEFECTO");
        }

        // Si se ha iniciado sesión, ya no es invitado
        this.isGuest = false;

        // Guardar los estados en localStorage
        localStorage.setItem('isFan', JSON.stringify(this.isFan));
        localStorage.setItem('isArtist', JSON.stringify(this.isArtist));
        localStorage.setItem('isGuest', JSON.stringify(this.isGuest));

        alert('✅ Login exitoso');

      // Redirigir al menú principal
      this.router.navigate(['/main-menu']);
    } else {
      alert('⚠️ Email o contraseña incorrectos');
    }
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
