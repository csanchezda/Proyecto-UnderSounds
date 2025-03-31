import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-individual-article-album',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './individual-article-album.component.html',
  styleUrls: ['./individual-article-album.component.css']
})
export class IndividualArticleAlbumComponent implements OnInit {
  album: any;
  albums: any[] = [];
  songs: any[] = []; // Añadir las canciones
  newReview: string = '';
  newRating: number = 1;
  descriptionVisible: boolean = false; 
  selectedFormat: string = "";

  constructor(private route: ActivatedRoute) {}

  //Método para cargar los álbumes y canciones al iniciar el componente
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
        this.albums = data;
      })
      .catch(error => console.error('Error cargando los álbumes:', error));
  }

  //Método para cargar los detalles del álbum seleccionado
  loadAlbumDetails(albumId: number) {
    this.album = this.albums.find(album => album.id === albumId);
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

  //Métdoo para calcular la calificación promedio del álbum
  albumRating(): number {
    if (!this.album || !this.album.Reviews.length) return 0;
    const total = this.album.Reviews.reduce((acc: number, review: { rating: number; }) => acc + review.rating, 0);
    return Math.round(total / this.album.Reviews.length);
  }

  //Método para seleccionar la calificación
  selectRating(rating: number) {
    this.newRating = rating;
  }

  //Método para cancelar la review
  cancelReview() {
    this.newReview = '';
    this.newRating = 1;
  }

  //Método para añadir una nueva review
  addReview() {
    if (this.album && this.newReview.trim()) {
      const newReviewObject = {
        userId: Date.now(),
        userName: "Nuevo Usuario",
        userImage: "assets/images/Circle.png",
        review: this.newReview,
        rating: this.newRating,
        date: new Date().toISOString().split('T')[0],
      };
      this.album.Reviews.push(newReviewObject);
      this.newReview = ''; 
      this.newRating = 1; 
    }
  }

  //Método para cargar las canciones del álbum seleccionado
  loadSongsForAlbum() {
    if (this.album) {
      const artistName = this.album.Artist;
      this.songs = this.songs.filter(song => song.Artist === artistName);
    }
  }

  //Método para descargar el álbum en diferentes formatos
  downloadAlbum() {
    if (this.selectedFormat) {
      const link = document.createElement('a');
      link.href = this.selectedFormat;
      link.download = this.getFileName(this.selectedFormat);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  //Método para obtener el nombre del archivo a partir de la ruta
  getFileName(filePath: string): string {
    return filePath.split('/').pop() || 'descarga';
  }

  //Método para mostrar u ocultar la descripción del álbum
  toggleDescription() {
    this.descriptionVisible = !this.descriptionVisible;
  }
}
