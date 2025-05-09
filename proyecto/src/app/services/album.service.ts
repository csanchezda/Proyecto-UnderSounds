import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Album {
  idAlbum: number;
  idUser: number;
  artistName?: string;
  name: string;
  //songs: string[];
  //genres: string[];
  description?: string;
  price: number;
  totalDuration: string;
  albumThumbnail: string;
  albumRelDate?: Date;
  wav?: string;
  flac?: string;
  mp3?: string;
  totalViews: number;
}

export interface AlbumSong {
  idSong: number;
  name: string;
  duration: string;
  thumbnail: string;
}

export interface AlbumUpload {
  idUser: number;
  name: string;
  description?: string;
  price: number;
  totalDuration?: string;
  albumThumbnail: string;
  albumRelDate: Date;
  wav: string;
  flac: string;
  mp3: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private baseUrl = environment.apiUrl;
  private selectedAlbumId: number | null = null;


  constructor(private http: HttpClient) { }

  getAllAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.baseUrl}/albums`);
  }

  getAllSongsByAlbumId(id: number): Observable<AlbumSong[]> {
    return this.http.get<AlbumSong[]>(`${this.baseUrl}/albums/${id}/songs`);
  }

  getAlbumById(id: number): Observable<Album> {
    console.log('GET Album URL:', `${this.baseUrl}/albums/${id}`); // Log the URL for debugging
    return this.http.get<Album>(`${this.baseUrl}/albums/${id}`);
  }

  getArtistNameById(id: number): Observable<string> {
    return this.http.get<{ name: string }>(`${this.baseUrl}/artists/${id}`).pipe(
      map(response => response.name)
    );
  }

  getUserFavoriteAlbums(userId: number): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.baseUrl}/users/${userId}/favorite-albums`);
  }


  getAllAlbumsByGenres(genre: string[]): Observable<Album[]> {
    const params = genre.map(g => `genres=${encodeURIComponent(g)}`).join('&');
    return this.http.get<Album[]>(`${this.baseUrl}/albums?${params}`);
  }

  getAlbumsByUserId(userId: number): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.baseUrl}/albums/user/${userId}`);
  }

  setSelectedAlbumId(id: number) {
    this.selectedAlbumId = id;
  }

  getSelectedAlbumId(): number | null {
    return this.selectedAlbumId;
  }

  uploadAudio(file: FormData): Observable<{ wav: string; flac: string; mp3: string }> {
    return this.http.post<{ wav: string; flac: string; mp3: string }>(`${this.baseUrl}/albums/upload/audio`, file);
  }

  createAlbumWithSongs(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/albums`, formData);
  }

  uploadAlbum(album: AlbumUpload): Observable<AlbumUpload> {
    return this.http.post<AlbumUpload>(`${this.baseUrl}/albums`, album);
  }

  modifyAlbum(id: number, albumData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/albums/${id}`, albumData);
  }
}