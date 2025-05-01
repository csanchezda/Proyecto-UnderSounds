import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlbumService, Album } from '../../services/album.service';
import { SongService, Song } from '../../services/song.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-discography',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-discography.component.html',
  styleUrls: ['./view-discography.component.css']
})
export class ViewDiscographyComponent implements OnInit {
  songs: Song[] = [];
  albums: Album[] = [];
  currentUserId: number | null = null;

  constructor(
    private router: Router,
    private albumService: AlbumService,
    private songService: SongService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const user = await this.authService.getUserProfile();
      this.currentUserId = user.idUser;

      this.loadSongs();
      this.loadAlbums();
    } catch (error) {
      console.error('⚠️ No se pudo obtener el usuario actual:', error);
    }
  }

  loadSongs() {
    if (this.currentUserId !== null) {
      this.songService.getAllSongs().subscribe({
        next: (data) => {
          this.songs = data.filter(song => song.idUser === this.currentUserId);
        },
        error: (error) => {
          console.error('❌ Error cargando canciones desde el backend:', error);
        }
      });
    }
  }

  loadAlbums() {
    if (this.currentUserId !== null) {
      this.albumService.getAlbumsByUserId(this.currentUserId).subscribe({
        next: (data) => {
          this.albums = data;
        },
        error: (error) => {
          console.error('❌ Error cargando álbumes desde el backend:', error);
        }
      });
    }
  }

  navigateToModifySong(songId: number) {
    this.router.navigate(['/modify-song', songId]);
  }

  navigateToUploadSong() {
    this.router.navigate(['/upload-song']);
  }

  navigateToModifyAlbum() {
    this.router.navigate(['/modify-album']);
  }

  navigateToCreateAlbum() {
    this.router.navigate(['/create-album']);
  }
}
