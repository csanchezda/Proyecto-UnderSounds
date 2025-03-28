import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-individual-artist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './individual-artist.component.html',
  styleUrls: ['./individual-artist.component.css']
})
export class IndividualArtistComponent implements OnInit {
  artist: any;
  artists: any[] = [];
  songs: any[] = [];
  albums: any[] = [];
  isFavorite: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadArtists();
    this.loadSongsAndAlbums();  // Cargar las canciones y los álbumes
    this.route.params.subscribe(params => {
      const artistName = params['artistName'];
      this.loadArtistDetails(artistName);
    });
  }

  loadArtists() {
    fetch('assets/data/ArtistsList.json')
      .then(response => response.json())
      .then(data => {
        this.artists = data;
        this.route.params.subscribe(params => {
          const artistName = params['artistName'].trim();
          this.loadArtistDetails(artistName);
        });
      })
      .catch(error => console.error('Error cargando los artistas:', error));
  }

  loadSongsAndAlbums() {
    // Cargar canciones desde el archivo SongsList.json
    fetch('assets/data/SongsList.json')
      .then(response => response.json())
      .then(data => {
        this.songs = data;
      })
      .catch(error => console.error('Error cargando las canciones:', error));

    // Cargar álbumes desde el archivo AlbumsList.json
    fetch('assets/data/AlbumsList.json')
      .then(response => response.json())
      .then(data => {
        this.albums = data;
      })
      .catch(error => console.error('Error cargando los álbumes:', error));
  }

  loadArtistDetails(artistName: string) {
    this.artist = this.artists.find(a => this.formatArtistName(a.ArtistName) == artistName);
  }

  formatArtistName(artistName: string): string {
    return artistName.replace(/\s+/g, '-');
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;  // Cambia el estado de favorito
  }

  shareArtist() {
    const shareUrl = window.location.href;  // URL actual
    alert(`Compartir artista: ${shareUrl}`);
  }
}
