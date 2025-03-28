import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-discography',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-discography.component.html',
  styleUrl: './view-discography.component.css'
})
export class ViewDiscographyComponent {
  constructor(private router: Router) {}
  songs: any[] = [];
  albums: any[] = [];

  ngOnInit(): void {
    this.loadSongs();
    this.loadAlbums();
  }

  loadSongs() {
    fetch('assets/images/discography/artistSongs.json')
      .then(response => response.json())
      .then(data => {
        this.songs = data;
      })
      .catch(error => console.error('Error cargando las canciones:', error));
  }

  loadAlbums() {
    fetch('assets/images/discography/artistAlbums.json')
      .then(response => response.json())
      .then(data => {
        this.albums = data;
      })
      .catch(error => console.error('Error cargando los albums:', error));
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
