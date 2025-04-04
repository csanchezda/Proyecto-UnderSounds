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

  // Método que carga los artistas, canciones y álbumes al iniciar el componente
  ngOnInit(): void {
    this.loadArtists();
    this.loadSongsAndAlbums();
    this.route.params.subscribe(params => {
      const artistName = params['artistName'];
      this.loadArtistDetails(artistName);
    });
  }

  // Método que carga los artistas desde el archivo JSON
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

  // Método que carga las canciones y álbumes desde los archivos JSON
  loadSongsAndAlbums() {
    fetch('assets/data/SongsList.json')
      .then(response => response.json())
      .then(data => {
        this.songs = data;
      })
      .catch(error => console.error('Error cargando las canciones:', error));

    fetch('assets/data/AlbumsList.json')
      .then(response => response.json())
      .then(data => {
        this.albums = data;
      })
      .catch(error => console.error('Error cargando los álbumes:', error));
  }

  // Método que carga los detalles del artista seleccionado
  loadArtistDetails(artistName: string) {
    this.artist = this.artists.find(a => this.formatArtistName(a.ArtistName) == artistName);
  }

  // Método que formatea el nombre del artista para la URL
  formatArtistName(artistName: string): string {
    return artistName.replace(/\s+/g, '-');
  }

  // Métddo que cambia el estado de favorito del artista
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  // Método que comparte el artista a través de un enlace
  shareArtist() {
    const shareUrl = window.location.href;
    alert(`Compartir artista: ${shareUrl}`);
  }
}
