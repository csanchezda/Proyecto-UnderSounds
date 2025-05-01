import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlbumService, Album } from '../../services/album.service';

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

  constructor(private route: ActivatedRoute,
    private router: Router, private albumService: AlbumService // Inyectar Router aquí
  ) {}

  //Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loadAlbumDetails(); // Cargar detalles del álbum
    this.loadSongs(); // Cargar canciones del álbum
  }

  //Método para cargar los álbumes desde un archivo JSON
  loadAlbums() {
    this.albumService.getAllAlbums().subscribe({
      next: (data) => {
        this.albums = data;
      },
      error: (error) => {
        console.error('Error loading albums:', error);
      }
    });
  }

  //Método para cargar las canciones desde un archivo JSON
  loadSongs(): void {
    const id = this.albumService.getSelectedAlbumId(); // Obtén el ID del álbum seleccionado
    if (id) {
      this.albumService.getAllSongsByAlbumId(id).subscribe({
        next: (data) => {
          this.songs = data; // Asigna las canciones obtenidas
          console.log('Canciones del álbum:', this.songs);
        },
        error: (error) => {
          console.error('Error al cargar las canciones:', error);
        }
      });
    } else {
      console.error('No se ha seleccionado un álbum.');
    }
  }

  //Método para cargar los detalles del álbum seleccionado
  loadAlbumDetails() {
    const id = this.albumService.getSelectedAlbumId();
    if (id) {
      this.albumService.getAlbumById(id).subscribe({
        next:(album) => {
          this.album =album;
          console.log('Detalles de la canción:', this.album);
        },
        error: () => this.router.navigate(['/']) 
      });
    }
    else {
      alert("Este album no está disponible directamente. Vuelve a la lista.");
      this.router.navigate(['/']);
    }
  }

  //Método para cargar las canciones del álbum seleccionado
  loadSongsForAlbum() {
    if (this.album) {
      const artistName = this.album.Artist;
      this.songs = this.songs.filter(song => song.Artist === artistName);
    }
  }

  //Método para marcar el álbum como favorito
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  //Método para compartir el álbum
  shareAlbum() {
    const shareUrl = window.location.href;
    alert(`Compartir álbum: ${shareUrl}`);
  }

  //Métdodo para ver el álbum en la tienda
  viewInStore(id: string) {
    this.router.navigate([`/shop/albums/${id}`]);
  }
  
}