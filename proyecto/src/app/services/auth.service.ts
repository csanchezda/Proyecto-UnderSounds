import { Injectable } from '@angular/core';
import { auth } from '../firebase.config'; 
import { BehaviorSubject } from 'rxjs'; // Usado para emitir el estado de autenticación
import { signInWithEmailAndPassword, Auth } from 'firebase/auth';
import { jwtDecode } from 'jwt-decode'; // Asegurate de importar esto
import { StorageService } from './storage.service';
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  // Asegúrate de que la ruta sea correcta

  constructor(private storage: StorageService, private router: Router) {
    // Al iniciar, intentar cargar el token desde el almacenamiento
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      this.tokenSubject.next(storedToken);
    }
  }

  // Obtener el token actual
  get token() {
    return this.tokenSubject.asObservable();
  }

  // Obtener un nuevo token (renovar)
  async refreshToken(): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const newToken = await currentUser.getIdToken(true);  // Esto fuerza la renovación
        this.tokenSubject.next(newToken);
        localStorage.setItem('auth_token', newToken); // Guarda el nuevo token
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
    this.storage.removeLocal('auth_token'); // Asegúrate de eliminar el token de Firebase
    this.storage.setLocal('isGuest', JSON.stringify(true));
    alert("La sesión ha expirado. Redirigiendo a la menú principal...");
    this.router.navigate(['/main-menu']);
  }
}