import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService, User } from '../../services/user.service';

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

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {}

  // Método que carga los artistas, canciones y álbumes al iniciar el componente
  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists() {
    const id = this.userService.getSelectedArtistId();
  
    if (id !== null) {
      this.userService.getUserById(id).subscribe({
        next: (artist) => {
          this.artist = artist;
          this.loadSongsAndAlbums(artist.idUser);
        },
        error: () => {
          this.router.navigate(['/']);
        }
      });
    } else {
      alert("Este artista no está disponible directamente. Vuelve a la lista.");
      this.router.navigate(['/']);
    }
  }
  

  // Método que carga las canciones y álbumes desde los archivos JSON
  loadSongsAndAlbums(artistId: number): void {
    this.userService.getSongsByArtist(artistId).subscribe({
      next: (songs) => {
        this.songs = songs;
      },
      error: (err) => {
        console.error('❌ Error al cargar canciones del artista:', err);
        this.songs = [];
      }
    });
  
    this.userService.getAlbumsByArtist(artistId).subscribe({
      next: (albums) => {
        this.albums = albums;
      },
      error: (err) => {
        console.error('❌ Error al cargar álbumes del artista:', err);
        this.albums = [];
      }
    });
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
