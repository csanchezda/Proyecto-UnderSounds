import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  constructor(private router: Router, private songService: SongService, private userService: UserService) {}
  songs: Song[] = [];
  albums: any[] = [];

  ngOnInit(): void {
    this.loadSongs();
    this.loadAlbums();
  }

  getCurrentArtistId(): number | null{
    return this.userService.getCurrentUserId() ;
  }

  loadSongs() {
    const currentArtistId = this.getCurrentArtistId();

    if(currentArtistId != null) {
      this.songService.getAllSongs().subscribe({
        next: (data) => {
          this.songs = data.filter(song => song.idUser === currentArtistId);
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
    fetch('assets/data/artistAlbums.json')
      .then(response => response.json())
      .then(data => {
        this.albums = data;
      })
      .catch(error => console.error('Error cargando los albums:', error));
  }

  navigateToModifySong(song: Song) {
    this.router.navigate(['/modify-song', song.idSong]);
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
