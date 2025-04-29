import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ReviewService, Review } from '../../services/review.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-individual-article-song',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './individual-article-song.component.html',
  styleUrls: ['./individual-article-song.component.css']
})
export class IndividualArticleSongComponent implements OnInit {
  song: any;
  songs: any[] = [];
  isFavorite: boolean = false;
  newReview: string = '';
  newRating: number = 1;
  descriptionVisible: boolean = false;
  selectedFormat: string = "";
  reviews: Review[] = [];
  isFan: boolean = false;
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getProductById(id).subscribe(product => {
        this.song = {
          price: product.price,
          image: product.image,
          songReleaseDate: product.date,
          title: product.title,
          description: product.description,
          genre: [],
          artist: product.artistName,
          downloadOptions: [
            { format: 'WAV', file: product.wav },
            { format: 'FLAC', file: product.flac },
            { format: 'MP3', file: product.mp3 },
          ].filter(option => option.file)
        };
      });

      this.reviewService.getReviewsByProduct(id).subscribe(reviews => {
        this.reviews = reviews.filter(review => review.idProduct === id);
      });
    }

    this.isFan = JSON.parse(this.storage.getLocal('isFan') || 'false');
    this.currentUser = JSON.parse(this.storage.getLocal('currentUser') || 'null');
  }


  // Método para cargar la canción seleccionada y su información
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  // Método para compartir la canción a través de un enlace
  shareSong() {
    const shareUrl = window.location.href;
    alert(`Compartir canción: ${shareUrl}`);
  }

  // Método para añadir una reseña a la canción
  addReview() {
    if (this.newReview.trim() && this.currentUser) {
      const reviewToCreate = {
        idProduct: Number(this.route.snapshot.paramMap.get('id')),
        idUser: this.currentUser.idUser,
        review: this.newReview,
        rating: this.newRating,
        date: new Date().toISOString().split('T')[0]
      };

      this.reviewService.createReview(reviewToCreate).subscribe(newReview => {
        this.reviews.push(newReview); // Añadimos la nueva review
        this.newReview = '';
        this.newRating = 1;
      }, error => {
        console.error('Error al crear la reseña:', error);
      });
    }
  }

  // Método para calcular la valoración media de la canción
  songRating(): number {
    if (!this.reviews.length) return 0;
    const total = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round(total / this.reviews.length);
  }

  // Método para seleccionar la valoración al hacer clic en las estrellas
  selectRating(rating: number) {
    this.newRating = rating; // Actualiza la valoración al hacer clic
  }

  // Método para cancelar la reseña
  cancelReview() {
    this.newReview = '';
    this.newRating = 1;
  }

  // Método para añadir la canción al carrito de compras
  addToCart() {
    if (this.isFan) {
      alert('Canción añadida al carrito');
      // Aquí luego pondrías la lógica real para añadir al carrito
    } else {
      alert('⚠️ Debes ser un FAN para poder añadir esta canción al carrito.');
    }
  }

  // Método para ocultar o mostrar la descripción de la canción
  toggleDescription() {
    this.descriptionVisible = !this.descriptionVisible;
  }

  // Método para seleccionar el formato de descarga de la canción
  downloadSong() {
    if (this.selectedFormat) {
      const url = `http://localhost:8000/static/${this.selectedFormat}`;
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('Error al descargar la canción');
          return response.blob();
        })
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = this.getFileName(this.selectedFormat);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
          console.error('Error al descargar la canción:', error);
        });
    }
  }

  // Método para obtener el nombre del archivo a partir de la ruta
  getFileName(filePath: string): string {
    return filePath.split('/').pop() || 'descarga';
  }

  formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
}
