import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ReviewService, Review } from '../../services/review.service';
import { StorageService } from '../../services/storage.service';

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
  songs: any[] = [];
  newReview: string = '';
  newRating: number = 1;
  descriptionVisible: boolean = false;
  selectedFormat: string = "";
  reviews: Review[] = [];
  isFan: boolean = false;
  currentUser: any = null;
  songsLoaded: boolean = false; // 👈 CONTROL DE CARGA

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private reviewService: ReviewService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getProductById(id).subscribe(product => {
        this.album = {
          idProduct: product.idProduct,
          idAlbum: product.idAlbum,
          price: product.price,
          image: product.image,
          albumReleaseDate: product.date,
          title: product.title,
          description: product.description,
          artist: product.artistName,
          genre: [],

          downloadOptions: [
            { format: 'WAV', file: product.wav ? product.wav : '' },
            { format: 'FLAC', file: product.flac ? product.flac : '' },
            { format: 'MP3', file: product.mp3 ? product.mp3 : '' },
          ].filter(option => option.file !== '')
        };

        if (this.album.idAlbum) {
          this.loadSongs(this.album.idAlbum);
        }
      });

      this.reviewService.getReviewsByProduct(id).subscribe(reviews => {
        this.reviews = reviews.filter(review => review.idProduct === id);
      });
    }

    this.isFan = JSON.parse(this.storage.getLocal('isFan') || 'false');
    this.currentUser = JSON.parse(this.storage.getLocal('currentUser') || 'null');
  }


  loadSongs(albumId: number) {
    this.productService.getSongsByAlbumId(albumId).subscribe(
      songs => {
        this.songs = songs;
        this.songsLoaded = true;
      },
      error => {
        console.error('Error cargando las canciones del álbum:', error);
      }
    );
  }

  albumRating(): number {
    if (!this.reviews.length) return 0;
    const total = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round(total / this.reviews.length);
  }

  selectRating(rating: number) {
    this.newRating = rating;
  }

  cancelReview() {
    this.newReview = '';
    this.newRating = 1;
  }

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
        this.reviews.push(newReview);
        this.newReview = '';
        this.newRating = 1;
      }, error => {
        console.error('Error al crear la reseña:', error);
      });
    }
  }

  downloadAlbum() {
    if (this.selectedFormat) {
      const url = `http://localhost:8000/static/${this.selectedFormat}`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error descargando el archivo');
          }
          return response.blob();
        })
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = this.getFileName(this.selectedFormat);
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
          console.error('Error al descargar el archivo:', error);
        });
    }
  }

  getFileName(filePath: string): string {
    return filePath.split('/').pop() || 'descarga';
  }

  toggleDescription() {
    this.descriptionVisible = !this.descriptionVisible;
  }

  addToCart() {
    if (this.isFan) {
      alert('Álbum añadido al carrito');
    } else {
      alert('⚠️ Debes ser un FAN para poder añadir este álbum al carrito.');
    }
  }

  formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }

  goToArticle(idProduct: number, isSong: boolean) {
    if (isSong) {
      this.router.navigate(['/songs', idProduct]);
    } else {
      this.router.navigate(['/albums', idProduct]);
    }
  }
}
