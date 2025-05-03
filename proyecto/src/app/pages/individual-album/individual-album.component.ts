import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlbumService, Album } from '../../services/album.service';
import { environment } from '../../../environments/environment';
import { ProductService } from '../../services/product.service';

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
  apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute,
    private router: Router, private albumService: AlbumService, private productService: ProductService // Inyectar Router aquí
  ) {}

  //Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      console.log('Nuevo ID detectado:', id);

      if (id) {
        this.albumService.setSelectedAlbumId(id); // opcional
        this.loadAlbumDetails(id);
        this.loadSongs(id);
      } else {
        alert("Este álbum no está disponible directamente. Vuelve a la lista.");
        this.router.navigate(['/']);
      }
    });
  }


  //Método para cargar los álbumes desde un archivo JSON
  loadAlbums() {
    this.albumService.getAllAlbums().subscribe({
      next: (data) => {
        this.albums = data;
      },
      error: (error) => {
        console.error('Error al cargar el álbum:', error);
        alert('No se pudo cargar el álbum.');
        this.router.navigate(['/']);
      }
    });
  }

  //Método para cargar las canciones desde un archivo JSON
  loadSongs(id: number) {
    this.albumService.getAllSongsByAlbumId(id).subscribe({
      next: (songs) => {
        this.songs = songs;
        console.log('Canciones del álbum:', this.songs);
      },
      error: (err) => {
        console.error('Error al obtener canciones:', err);
      }
    });
  }

  //Método para cargar los detalles del álbum seleccionado
  loadAlbumDetails(id: number) {
    this.albumService.getAlbumById(id).subscribe({
      next: (album) => {
        this.album = album;
        console.log('Detalles del álbum:', this.album);
      },
      error: (err) => {
        console.error('Error al obtener álbum:', err);
        alert("No se pudo obtener el álbum.");
        this.router.navigate(['/albums']);
      }
    });
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

  //Método para ver el álbum en la tienda
  viewInStore() {
    this.productService.getProductByAlbumId(this.album.idAlbum).subscribe({
      next: (product) => {
        this.router.navigate(['/albums', product.idProduct]);
      },
      error: () => {
        alert('Este álbum no tiene producto asociado en la tienda.');
      }
    });
  }

}
