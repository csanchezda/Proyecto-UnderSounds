import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from  './storage.service';


export interface User {
  idUser: number;
  name: string;
  userName: string;
  email: string;
  followerNumber: number;
  nationality: string;
  description: string;
  isArtist: boolean;
  profilePicture?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8000';
  private selectedArtistId: number | null = null;


  constructor(private http: HttpClient,private storage: StorageService) { }
  

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getAllArtists(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/artists`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  getAllArtistsByCountries(countries: string[]): Observable<User[]> {
    const params = countries.map(c => `nationalities=${encodeURIComponent(c)}`).join('&');
    return this.http.get<User[]>(`${this.baseUrl}/artists?${params}`);
  }

  setSelectedArtistId(id: number) {
    this.selectedArtistId = id;
  }

  getSelectedArtistId(): number | null {
    return this.selectedArtistId;
  }
  
  registerUser(userData: any): Observable<any> {
    return this.http.post('http://localhost:8000/users/register', userData);
  }
  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:8000/users/login', credentials);
  }

  getUserData() {
    const token = this.storage.getLocal('firebaseToken');
    const id = this.storage.getLocal('currentUser.idUser');
     // Asegúrate de que el ID del usuario esté almacenado en el localStorage
    if (!token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`http://localhost:8000/users/${id}`, { headers });
  }
  
}
