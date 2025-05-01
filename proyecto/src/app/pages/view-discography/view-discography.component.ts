import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlbumService, Album } from '../../services/album.service';
import { SongService, Song } from '../../services/song.service';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-view-discography',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-discography.component.html',
  styleUrl: './view-discography.component.css'
})
export class ViewDiscographyComponent {
  constructor(private router: Router, private albumService: AlbumService, private songService: SongService, private userService: UserService) {}
  songs: Song[] = [];
  albums: Album[] = [];
  currentUserId: number | null = null;

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser || !currentUser.idUser) {
      console.error('No se ha encontrado el id del artistact.');
      return;
    }
    this.currentUserId = currentUser.idUser;
    this.loadSongs();
    this.loadAlbums();
  }


  loadSongs() {
    if(this.currentUserId != null) {
      this.songService.getAllSongs().subscribe({
        next: (data) => {
          this.songs = data.filter(song => song.idUser === this.currentUserId);
        },
        error: (error) => {
          console.error('Error cargando canciones desde el backend:', error);
        }
      });
    }
    else {
      console.error('Error: No se ha encontrado el id del artista actual.');
    }
  }

  loadAlbums() {
    const currentUserId = this.userService.getCurrentUserId(); // Obtener el ID del usuario actual
    if (currentUserId) {
      this.albumService.getAlbumsByUserId(currentUserId).subscribe({
        next: (data) => {
          this.albums = data; // Cargar solo los álbumes del usuario
        },
        error: (error) => {
          console.error('Error loading albums:', error);
        }
      });
    } else {
      console.error('No se pudo obtener el usuario actual.');
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
