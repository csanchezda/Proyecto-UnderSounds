import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoxContainerComponent } from '../../box-container/box-container.component';
import { StorageService } from '../../services/storage.service';
import { signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, UserCredential, TwitterAuthProvider, GithubAuthProvider } from 'firebase/auth'; // Importa desde 'firebase/auth'
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [BoxContainerComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';


  constructor(
    private router: Router,
    private storage: StorageService,
    private userService: UserService
  ) {}

  login() {
    if (!this.email || !this.password) {
      alert('⚠️ Por favor, introduce el email y la contraseña.');
      return;
    }
  
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const token = await user.getIdToken();
  
        this.storage.setLocal('auth_token', token);

  
        console.log('✅ Login exitoso con Firebase');
  
        setTimeout(() => {
          const pending = sessionStorage.getItem('resetPasswordPending');
          const resetEmail = sessionStorage.getItem('resetEmail');
  
          if (pending === 'true' && resetEmail === this.email) {
            console.log('⚠️ Usuario debe actualizar su contraseña');
            this.router.navigate(['/confirm-new-password']);
          } else {
            console.log('🔵 Usuario normal, redirigiendo a menú');
            this.router.navigate(['/main-menu']);
          }
        }, 200);
      })
      .catch((error: any) => {
        console.error('❌ Error al iniciar sesión:', error);
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

  googleLogin() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
  
    signInWithPopup(auth, provider)
      .then(async (result: UserCredential) => {
        const user = result.user;
        const token = await user.getIdToken();
        this.storage.setLocal('auth_token', token);
  

  
        // Comprobar si el usuario existe en la BD
        const email = user.email!;
        try {
          const existingUser = await firstValueFrom(this.userService.getCurrentUser());
          console.log('🔵 Usuario ya existe en la base de datos:', existingUser);
          this.router.navigate(['/main-menu']);
        } catch (err: any) {
          if (err.status === 404) {
            const newUser = {
              userName: (user.displayName?.replace(/\s/g, '').toLowerCase() || 'googleuser') + Math.floor(Math.random() * 10000),
              name: user.displayName || 'Usuario Google',
              email: user.email,
              password: crypto.randomUUID(), // o algo fijo como "GoogleLogin123@" si el backend lo permite
              nationality: 'Desconocida',
              description: 'Cuenta creada con Google',
              isArtist: false,
              profilePicture: user.photoURL || null
            };
  
            try {
              await firstValueFrom(this.userService.registerUser(newUser));
              console.log('✅ Usuario registrado automáticamente desde Google');
            } catch (registerError) {
              console.error('❌ Error al registrar usuario con Google:', registerError);
              alert('⚠️ No se pudo registrar el usuario automáticamente');
            }
  
            this.router.navigate(['/main-menu']);
          } else {
            console.error('❌ Error verificando usuario en BD:', err);
            alert('⚠️ Error verificando la cuenta del usuario');
          }
        }
      })
      .catch((error: any) => {
        console.error('❌ Error en el login con Google:', error);
        alert('⚠️ Error al iniciar sesión con Google');
      });
  }
  

  twitterLogin() {
    const provider = new TwitterAuthProvider();
    const auth = getAuth();
  
    signInWithPopup(auth, provider)
      .then(async (result: UserCredential) => {
        const user = result.user;
        console.log('🐦 Twitter Login Success:', user);
  
        const token = await user.getIdToken();
        this.storage.setLocal('auth_token', token);
  
        try {
          // Comprobar si el usuario ya existe en backend
          const existingUser = await firstValueFrom(this.userService.getCurrentUser());
          console.log('🔵 Usuario ya existe:', existingUser);
          this.router.navigate(['/main-menu']);
        } catch (err: any) {
          if (err.status === 404) {
            // Usuario nuevo → registrar
            const newUser = {
              userName: (user.displayName?.replace(/\s/g, '').toLowerCase() || 'twitteruser') + Math.floor(Math.random() * 10000),
              name: user.displayName || 'Usuario Twitter',
              email: user.email || `tw${Math.floor(Math.random() * 100000)}@twitter.fake`, // fallback por si Twitter no da email
              password: crypto.randomUUID(), // contraseñas aleatoria segura
              nationality: 'Desconocida',
              description: 'Cuenta creada con Twitter',
              isArtist: false,
              profilePicture: user.photoURL || null
            };
  
            try {
              await firstValueFrom(this.userService.registerUser(newUser));
              console.log('✅ Usuario registrado desde Twitter');
            } catch (registerError) {
              console.error('❌ Error al registrar usuario con Twitter:', registerError);
              alert('⚠️ Registro fallido. Verifica los datos enviados.');
              return;
            }
  
            this.router.navigate(['/main-menu']);
          } else {
            console.error('❌ Error al verificar usuario:', err);
            alert('⚠️ No se pudo verificar la cuenta del usuario.');
          }
        }
      })
      .catch((error: any) => {
        console.error('❌ Error en el login con Twitter:', error);
        alert('⚠️ Error al iniciar sesión con Twitter: ' + error.message);
      });
  }
  

  githubLogin() {
    const provider = new GithubAuthProvider();
    const auth = getAuth();
  
    signInWithPopup(auth, provider)
      .then(async (result: UserCredential) => {
        const user = result.user;
        console.log('🐙 GitHub Login Success:', user);
  
        const token = await user.getIdToken();
        this.storage.setLocal('auth_token', token);
  
        try {
          // Verificar si ya está en la base de datos
          const existingUser = await firstValueFrom(this.userService.getCurrentUser());
          console.log('🔵 Usuario ya existe:', existingUser);
          this.router.navigate(['/main-menu']);
        } catch (err: any) {
          if (err.status === 404) {
            // Usuario nuevo → registrar
            const newUser = {
              userName: (user.displayName?.replace(/\s/g, '').toLowerCase() || 'githubuser') + Math.floor(Math.random() * 10000),
              name: user.displayName || 'Usuario GitHub',
              email: user.email || `gh${Math.floor(Math.random() * 100000)}@github.fake`,
              password: crypto.randomUUID(), // Contraseña segura generada automáticamente
              nationality: 'Desconocida',
              description: 'Cuenta creada con GitHub',
              isArtist: false,
              profilePicture: user.photoURL || null
            };
  
            try {
              await firstValueFrom(this.userService.registerUser(newUser));
              console.log('✅ Usuario registrado desde GitHub');
            } catch (registerError) {
              console.error('❌ Error al registrar usuario con GitHub:', registerError);
              alert('⚠️ Registro fallido. Verifica los datos enviados.');
              return;
            }
  
            this.router.navigate(['/main-menu']);
          } else {
            console.error('❌ Error al verificar usuario en BD:', err);
            alert('⚠️ No se pudo verificar la cuenta del usuario.');
          }
        }
      })
      .catch((error: any) => {
        console.error('❌ Error en el login con GitHub:', error);
        alert('⚠️ Error al iniciar sesión con GitHub: ' + error.message);
      });
  }
  
  

}
