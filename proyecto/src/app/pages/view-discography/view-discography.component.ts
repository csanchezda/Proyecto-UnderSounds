import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-discography',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-discography.component.html',
  styleUrl: './view-discography.component.css'
})
export class ViewDiscographyComponent {
  songs: any[] = [];
  albums: any[] = [];

  ngOnInit(): void {
    this.loadSongs();
    this.loadAlbums();
  }

  loadSongs() {
    this.songs = [
      { name: 'Canción 1', image: 'assets/images/artists/artist1.png' },
      { name: 'Canción 2', image: 'assets/images/artists/artist1.png' },
      { name: 'Canción 3', image: 'assets/images/artists/artist1.png' },
      { name: 'Canción 4', image: 'assets/images/artists/artist1.png' }
    ];
  }

  loadAlbums() {
    this.albums = [
      { name: 'Álbum 1', image: 'assets/images/Square.png', duration: '23:00' },
      { name: 'Álbum 2', image: 'assets/images/Square.png', duration: '25:00' },
      { name: 'Álbum 3', image: 'assets/images/Square.png', duration: '31:00' },
      { name: 'Álbum 4', image: 'assets/images/Square.png', duration: '26:00' }
    ];
  }
}
