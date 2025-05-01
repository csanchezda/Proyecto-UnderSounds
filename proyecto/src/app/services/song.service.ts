import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs'
import path from 'path';

export interface Song {
  idSong: number;
  idUser: number;
  name: string;
  description: string;
  songDuration?: number; 
  price: number;
  songReleaseDate: Date; 
  thumbnail?: string; 
  wav?: string; 
  flac?: string; 
  mp3?: string; 
  views: number;
  artistName?: string;
  genre?: string[];
}

export interface SongUpload {
  idUser: number;
  name: string;
  description?: string;
  songDuration?: number;
  price: number;
  songReleaseDate: Date; 
  thumbnail: string;
  wav: string;
  flac: string;
  mp3: string;
  genre: string[];
  artistName?: string;
}

export interface SongUpdate {
  thumbnail?: string;
	name?: string;
  wav?: string;
  flac?: string;
  mp3?: string;
  genre?: string[];
  price?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private baseUrl = 'http://localhost:8000';
  private selectedSongId: number | null = null;
  
  constructor(private http: HttpClient) { }

    getAllSongs(): Observable<Song[]> {
      return this.http.get<Song[]>(`${this.baseUrl}/songs`);
    }

    getSongById(id: number): Observable<Song> {
      return this.http.get<Song>(`${this.baseUrl}/songs/${id}`);
    }

    setSelectedSongId(id: number) {
      this.selectedSongId = id;
    }

    getSelectedSongId(): number | null {
      return this.selectedSongId;
    }
    
    getAllSongsByGenres(genres: string[]): Observable<Song[]> {
      const params = genres.map(c => `genres=${encodeURIComponent(c)}`).join('&');
      return this.http.get<Song[]>(`${this.baseUrl}/songs?${params}`);
    }

    uploadAudio(file: FormData): Observable<{ wav: string; flac: string; mp3: string }> {
      return this.http.post<{ wav: string; flac: string; mp3: string }>(`${this.baseUrl}/songs/upload/audio`, file);
    }
    
    uploadSong(song: Song): Observable<Song> {
      return this.http.post<Song>(`${this.baseUrl}/songs/`, song);
    }

    uploadSongUpdate(song: SongUpload): Observable<SongUpload> {
      return this.http.post<SongUpload>(`${this.baseUrl}/songs/`, song);
    }

    updateSong(songId: number | null, song: SongUpdate): Observable<Song> {
      return this.http.put<Song>(`${this.baseUrl}/songs/${songId}`, song);
    }

    deleteSong(songId: number| null): Observable<any> {
      return this.http.delete<Song>(`${this.baseUrl}/songs/${songId}`);
    }

}
