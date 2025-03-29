import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private route: ActivatedRoute,
    private router: Router // Inyectar Router aquí
  ) {}

  //Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const albumId = +params['id']; 
      Promise.all([this.loadAlbums(), this.loadSongs()]).then(() => {
        this.loadAlbumDetails(albumId);
        this.loadSongsForAlbum();
      });
    });
  }

  //Método para cargar los álbumes desde un archivo JSON
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

  //Método para cargar las canciones desde un archivo JSON
  loadSongs(): Promise<void> {
    return fetch('assets/data/SongsList.json')
      .then(response => response.json())
      .then(data => {
        this.songs = data;
      })
      .catch(error => console.error('Error cargando las canciones:', error));
  }

  //Método para cargar los detalles del álbum seleccionado
  loadAlbumDetails(albumId: number) {
    this.album = this.albums.find(a => a.id === albumId);
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