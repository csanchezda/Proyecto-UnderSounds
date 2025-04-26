import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoxContainerComponent } from '../../box-container/box-container.component';
import { StorageService } from '../../services/storage.service'; // ⬅ importa el servicio
import { UserService } from '../../services/user.service';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';

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
    { name: 'Admin Fan', username:'adminFan', email: 'fan@example.com', password: 'Fan1234@', nationality: 'Spain' },
    { name: 'Admin Artista', username:'adminArtista', email: 'artist@example.com', password: 'Artista1234@', nationality: 'Spain' }
  ];

  constructor(
    private router: Router,
    private storage: StorageService, // Agrega StorageService
    private userService: UserService
  ) {}

  login() {
    if (!this.email || !this.password) {
      alert('⚠️ Por favor, introduce el email y la contraseña.');
      return;
    }
  
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
  
        const token = await user.getIdToken(); //JWT de Firebase
  
        console.log('🧾 JWT:', token);
  
        const credentials = {
          email: this.email,
          password: this.password
        };
      
        this.storage.setLocal('auth_token', token);

        this.userService.loginUser(credentials).subscribe({
          next: (user) => {
            // Guardar sesión
            this.storage.setLocal('currentUser', JSON.stringify(user));
            this.storage.setLocal('isArtist', JSON.stringify(user.isArtist));
            this.storage.setLocal('isFan', JSON.stringify(!user.isArtist));
            this.storage.setLocal('isGuest', JSON.stringify(false));
      
            this.isFan = !user.isArtist;
            this.isArtist = user.isArtist;
            this.isGuest = false;
      
            console.log(`Soy ${this.isArtist ? 'ARTISTA' : 'FAN'}`);
            alert('✅ Login exitoso');
            this.router.navigate(['/main-menu']);
          },
          error: (err) => {
            console.error('❌ Error al iniciar sesión:', err);
            alert('⚠️ Email o contraseña incorrectos');
          }
        });
  
      })
      .catch((error) => {
        console.error('❌ Firebase login error:', error);
        alert('⚠️ Email o contraseña incorrectos');
      });
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
