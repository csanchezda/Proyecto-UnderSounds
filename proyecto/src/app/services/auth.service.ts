import { Injectable } from '@angular/core';
import { auth } from '../firebase.config'; 
import { BehaviorSubject } from 'rxjs'; 
import { signInWithEmailAndPassword, Auth, sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { jwtDecode } from 'jwt-decode'; 
import { StorageService } from './storage.service';
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private isArtist: boolean = false;
  private isFan: boolean = false;
  private profilePictureUrl: string = 'assets/icons/profile.svg';
  private auth = getAuth();


  constructor(private storage: StorageService, private router: Router) {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      this.tokenSubject.next(storedToken);
      this.loadUserInfo();
    }
    
  }

  private loadUserInfo() {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      this.isArtist = JSON.parse(localStorage.getItem('isArtist') || 'false');
      this.isFan = JSON.parse(localStorage.getItem('isFan') || 'false');
      this.profilePictureUrl = JSON.parse(localStorage.getItem('profilePicture') || '"assets/icons/profile.svg"');
    }
  }

  getProfilePictureUrl(): string {
    return this.profilePictureUrl;
  }

  getIsArtist(): boolean {
    return this.isArtist;
  }

  getIsFan(): boolean {
    return this.isFan; 
  }


  getToken(): string | null {
    return this.storage.getLocal('auth_token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  async refreshToken(): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const newToken = await currentUser.getIdToken(true);
        this.tokenSubject.next(newToken);
        localStorage.setItem('auth_token', newToken);
        console.log('Token renovado:', newToken);
      }
    } catch (error) {
      console.error('Error al renovar el token:', error);
    }
  }

  verifyToken(): boolean {
    const token = localStorage.getItem('auth_token');
  
    if (!token || !token.includes('.') || token.split('.').length !== 3) {
      this.logout();
      return false;
    }
  
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now();
  
      if (decoded.exp * 1000 < now) {
        console.warn("Token expirado");
        this.logout();
        return false;
      }
  
      return true;
    } catch (e) {
      console.error('Error al decodificar el JWT:', e);
      this.logout();
      return false;
    }
  }

  enviarCorreoRecuperacion(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log('Correo de recuperación enviado.');
        // Aquí puedes mostrar un mensaje de éxito al usuario
      })
      .catch((error) => {
        console.error('Error enviando correo de recuperación:', error);
        // Aquí puedes manejar errores como email no registrado
      });
  }

  

  // Método para cerrar sesión
  logout(): void {
    console.log("Cerrando sesión...");
    this.storage.removeLocal('currentUser');
    this.storage.removeLocal('isFan');
    this.storage.removeLocal('isArtist');
    this.storage.removeLocal('selectedUser');
    this.storage.removeLocal('usersList');
    this.storage.removeLocal('otherFollowersList');
    this.storage.removeLocal('favAlbums');
    this.storage.removeLocal('favSongs');
    this.storage.removeLocal('firebaseToken');
    this.storage.removeLocal('auth_token');
    this.storage.setLocal('isGuest', JSON.stringify(true));
    alert("La sesión ha expirado. Redirigiendo a la menú principal...");
    this.router.navigate(['/main-menu']);
  }
}