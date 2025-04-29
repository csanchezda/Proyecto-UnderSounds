import { Injectable } from '@angular/core';
import { auth } from '../firebase.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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


  constructor(private storage: StorageService, private router: Router, private http: HttpClient) {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      this.tokenSubject.next(storedToken);
      this.loadUserInfo();
    }
    
  }

  private async loadUserInfo() {
    try {
      await this.getUserProfile();
      console.log('Perfil cargado exitosamente.');
    } catch (e) {
      console.warn('No se pudo cargar perfil, cerrando sesión.');
      this.logout();
    }
  }
  

  getUserProfile(): Promise<any> {
    const token = this.getToken();
    if (!token) {
      console.error('No hay token disponible.');
      return Promise.reject('No token');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get('http://localhost:8000/users/me', { headers }).toPromise()
      .then((user: any) => {
        this.isArtist = user.isArtist;
        this.isFan = !user.isArtist;
        this.profilePictureUrl = user.profilePicture || 'assets/icons/profile.svg';
  
        return user;
      })
      .catch((error) => {
        console.error('Error al obtener el perfil:', error);
        throw error;
      });
  }

  getIsArtist(): boolean {
    return this.isArtist;
  }
  
  getIsFan(): boolean {
    return this.isFan;
  }

  
  getProfilePictureUrl(): string {
    return this.profilePictureUrl;
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

  async enviarCorreoRecuperacion(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Correo de recuperación enviado.');
    } catch (error) {
      console.error('Error enviando correo de recuperación:', error);
    }
  }


  logout(): void {
    console.log("Cerrando sesión...");
    this.storage.clearLocal();
    this.storage.setLocal('isGuest', JSON.stringify(true));
    this.router.navigate(['/main-menu']);
  }
  
}