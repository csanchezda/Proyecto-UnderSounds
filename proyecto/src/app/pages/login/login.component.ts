import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoxContainerComponent } from '../../box-container/box-container.component';
import { StorageService } from '../../services/storage.service';
import { signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, UserCredential, TwitterAuthProvider, GithubAuthProvider } from 'firebase/auth'; // Importa desde 'firebase/auth'

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

  isFan: boolean = false;
  isGuest: boolean = true;

  constructor(
    private router: Router,
    private storage: StorageService
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
      
        this.isGuest = false;
        this.isFan = true;
        


        console.log('✅ Login exitoso con Firebase');
        setTimeout(() => {
          const pending = sessionStorage.getItem('resetPasswordPending');
  
          if (pending === 'true') {
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
      .then((result: UserCredential) => {
        const user = result.user;
        console.log('Google Login Success:', user);

        user.getIdToken().then((token) => {
          this.storage.setLocal('auth_token', token);
        });
        this.isGuest = false;
        this.isFan = true;

        this.router.navigate(['/main-menu']);
      })
      .catch((error: any) => { 
        console.error('Error en el login con Google:', error);
        alert('Error al iniciar sesión con Google');
      });
  }

  twitterLogin() {
    const provider = new TwitterAuthProvider();
    const auth = getAuth();


    signInWithPopup(auth, provider)
      .then((result: UserCredential) => {
        const user = result.user;
        console.log('Twitter Login Success:', user);
        
        user.getIdToken().then((token) => {
          this.storage.setLocal('auth_token', token);
        });
        this.isGuest = false;
        this.isFan = true;
        
        this.router.navigate(['/main-menu']);
      })
      .catch((error: any) => {
        console.error('Error en el login con Twitter:', error);
        alert('Error al iniciar sesión con Twitter: ' + error.message);
      });
  }

  githubLogin() {
    const provider = new GithubAuthProvider();
    const auth = getAuth();
  
    signInWithPopup(auth, provider)
      .then((result: UserCredential) => {
        const user = result.user;
        console.log('GitHub Login Success:', user);
  
        user.getIdToken().then((token) => {
          this.storage.setLocal('auth_token', token);
        });
  
        this.isGuest = false;
        this.isFan = true;

  
        this.router.navigate(['/main-menu']);
      })
      .catch((error: any) => {
        console.error('Error en el login con GitHub:', error);
        alert('Error al iniciar sesión con GitHub: ' + error.message);
      });
  }
  

}