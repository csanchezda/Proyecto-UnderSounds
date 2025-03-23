import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-individual-album',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './individual-album.component.html',
  styleUrls: ['./individual-album.component.css']
})
export class IndividualAlbumComponent implements OnInit {
  album: any;
  albums: any[] = [];
  songs: any[] = []; // Añadir las canciones
  isFavorite: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const albumId = +params['id']; 
      Promise.all([this.loadAlbums(), this.loadSongs()]).then(() => {
        this.loadAlbumDetails(albumId);
        this.loadSongsForAlbum();
      });
    });
  }

  loadAlbums(): Promise<void> {
    return fetch('assets/data/AlbumsList.json')
      .then(response => response.json())
      .then(data => {
        this.albums = data.map((album: { id: number; Artist: string; Name: string; Duration: string; image: string; description: string; }) => ({
          id: album.id,
          Artist: album.Artist,
          Name: album.Name,
          Duration: album.Duration,
          image: album.image,
          description: album.description
        }));
      })
      .catch(error => console.error('Error cargando los álbumes:', error));
  }

  loadSongs(): Promise<void> {
    return fetch('assets/data/SongsList.json')
      .then(response => response.json())
      .then(data => {
        this.songs = data;
      })
      .catch(error => console.error('Error cargando las canciones:', error));
  }

  loadAlbumDetails(albumId: number) {
    this.album = this.albums.find(a => a.id === albumId);
  }

  loadSongsForAlbum() {
    if (this.album) {
      const artistName = this.album.Artist;
      this.songs = this.songs.filter(song => song.Artist === artistName);
    }
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  shareAlbum() {
    const shareUrl = window.location.href;
    alert(`Compartir álbum: ${shareUrl}`);
  }

  viewInStore() {
    const storeUrl = `https://www.youtube.com/watch?v=WnKejJ-Pww8`;
    window.open(storeUrl, '_blank');
  }
}