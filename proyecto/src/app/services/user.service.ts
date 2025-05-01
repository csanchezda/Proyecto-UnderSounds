import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { StorageService } from './storage.service';


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
  private baseUrl = 'http://localhost:8000/';
  private selectedArtistId: number | null = null;
  private apiUrl = `${this.baseUrl}/users`;

  constructor(private http: HttpClient, private storage: StorageService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.storage.getLocal('auth_token'); // usar el mismo token que se usa globalmente
    if (!token) {
      throw new Error('⚠️ No hay token en almacenamiento');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  getAllArtists(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/artists`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getAllArtistsByCountries(countries: string[]): Observable<User[]> {
    const params = countries.map(c => `nationalities=${encodeURIComponent(c)}`).join('&');
    return this.http.get<User[]>(`${this.baseUrl}/artists?${params}`);
  }

  setSelectedArtistId(id: number) : void {
    this.selectedArtistId = id;
  }

  getSelectedArtistId(): number | null {
    return this.selectedArtistId;
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  
  getCurrentUser(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/me`, { headers });
  }

  async actualizarPassword(email: string, nuevaPassword: string): Promise<void> {
    const payload = {
      email: email,
      password: nuevaPassword
    };

    try {
      await firstValueFrom(
        this.http.put(`${this.apiUrl}/update-password`, payload, {
          headers: { 'Content-Type': 'application/json' }
        })
      );
      console.log('✅ Contraseña actualizada correctamente en el backend.');
    } catch (error) {
      console.error('❌ Error actualizando la contraseña en el backend:', error);
      throw error;
    }
  }

  getFollowedArtists(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:8000/users/${userId}/followed-artists`);
  }

  getArtistsOrderedByName(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/artists/order/name`);
  }
  
  getArtistsOrderedByFollowers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/artists/order/followers`);
  }
  
  getArtistsOrderedByViews(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/artists/order/views`);
  }
  
  filterArtistsByCountryAndGenre(countries: string[], genres: string[]): Observable<User[]> {
    const payload = { countries, genres };
    return this.http.post<User[]>(`${this.baseUrl}/artists/filter`, payload);
  }
  
  
  searchArtistsByName(name: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/artists/search`, {
      params: { name }
    });
  }
  
  getFilteredArtists(name?: string, order?: string): Observable<User[]> {
    const params: any = {};
    if (name) params.name = name;
    if (order) params.order = order;
  
    return this.http.get<User[]>(`${this.baseUrl}/artists/filter`, { params });
  }
  

  
  
}
