import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SongService, Song } from '../../services/song.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-discography',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-discography.component.html',
  styleUrls: ['./view-discography.component.css']
})
export class ViewDiscographyComponent {
  songs: Song[] = [];
  albums: any[] = [];

  constructor(private authService: AuthService, private router: Router, private songService: SongService) {}

  ngOnInit(): void {
    this.authService.getUserProfile().then(user => {
      const artistId = user.idUser;
      this.loadSongs(artistId);
      this.loadAlbums();
    }).catch(() => {
      this.router.navigate(['/login']);
    });
  }

  loadSongs(artistId: number): void {
    this.songService.getAllSongs().subscribe({
      next: (data: Song[]) => {
        this.songs = data.filter(song => song.idUser === artistId);
      },
      error: (error: any) => {
        console.error('Error cargando canciones:', error);
      }
    });
  }

  loadAlbums(): void {
    fetch('assets/data/artistAlbums.json')
      .then(res => res.json())
      .then(data => this.albums = data)
      .catch(error => console.error('Error cargando álbumes:', error));
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