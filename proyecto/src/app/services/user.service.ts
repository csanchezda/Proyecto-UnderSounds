import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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


  constructor(private http: HttpClient) {}

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
  
}
