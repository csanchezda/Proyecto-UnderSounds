import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlbumService, Album } from '../../services/album.service';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-view-discography',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-discography.component.html',
  styleUrl: './view-discography.component.css'
})
export class ViewDiscographyComponent {
  constructor(private router: Router, private albumService: AlbumService, private userService: UserService) {}
  songs: any[] = [];
  albums: Album[] = [];

  ngOnInit(): void {
    this.loadSongs();
    this.loadAlbums();
  }

  loadSongs() {
    fetch('assets/data/artistSongs.json')
      .then(response => response.json())
      .then(data => {
        this.songs = data;
      })
      .catch(error => console.error('Error cargando las canciones:', error));
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

  navigateToModifySong() {
    this.router.navigate(['/modify-song']);
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
