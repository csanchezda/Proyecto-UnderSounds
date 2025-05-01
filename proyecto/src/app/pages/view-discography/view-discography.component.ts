import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlbumService, Album } from '../../services/album.service';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service'; 
import { SongService, Song } from '../../services/song.service'; 

@Component({
  selector: 'app-view-discography',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-discography.component.html',
  styleUrls: ['./view-discography.component.css']
})
export class ViewDiscographyComponent {
  constructor(private router: Router, private albumService: AlbumService, private userService: UserService, private authService: AuthService, private songService : SongService) {}
  songs: any[] = [];
  albums: Album[] = [];


  ngOnInit(): void {
    this.authService.getUserProfile().then(user => {
      const artistId = user.idUser;
      this.loadSongs(artistId);
      this.loadAlbums(artistId);
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

  loadAlbums(artistId: number): void {
    this.albumService.getAllAlbums().subscribe({
      next: (data: Album[]) => {
        this.albums = data.filter(album => album.idUser === artistId);
      },
      error: (error: any) => {
        console.error('Error cargando álbumes:', error);
      }
    });
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