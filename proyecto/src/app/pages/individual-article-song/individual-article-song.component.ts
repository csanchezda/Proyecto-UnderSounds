import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const songId = +params['id'];
      this.loadSongs().then(() => {
        this.loadSongDetails(songId);
        this.selectedFormat = ""; 
      });
    });
  }

  loadSongs(): Promise<void> {
    return fetch('assets/data/SongsList.json')
      .then(response => response.json())
      .then(data => {
        this.songs = data;
      })
      .catch(error => console.error('Error cargando las canciones:', error));
  }

  loadSongDetails(songId: number) {
    this.song = this.songs.find(song => song.id === songId);
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  shareSong() {
    const shareUrl = window.location.href;
    alert(`Compartir canción: ${shareUrl}`);
  }

  viewInStore() {
    
  }

  addReview() {
    if (this.song && this.newReview.trim()) {
      const newReviewObject = {
        userId: Date.now(), 
        userName: "Nuevo Usuario", 
        userImage: "assets/images/Circle.png", 
        review: this.newReview,
        rating: this.newRating, 
        date: new Date().toISOString().split('T')[0],
      };
      this.song.Reviews.push(newReviewObject);
      this.newReview = ''; 
      this.newRating = 1; 
      const newTotalRating = this.songRating();
      this.song.averageRating = newTotalRating;
    }
  }

  songRating(): number {
    if (!this.song || !this.song.Reviews.length) return 0;
    const total = this.song.Reviews.reduce((acc: number, review: { rating: number; }) => acc + review.rating, 0);
    return Math.round(total / this.song.Reviews.length);
  }

  selectRating(rating: number) {
    this.newRating = rating; // Actualiza la valoración al hacer clic
  }
  cancelReview() {
    this.newReview = '';
    this.newRating = 1;
  }

  addToCart() {
    alert('Canción añadida al carrito');
  }


  toggleDescription() {
    this.descriptionVisible = !this.descriptionVisible;
  }

downloadSong() {
  if (this.selectedFormat) { // Solo descarga si se ha seleccionado un formato válido
    const link = document.createElement('a');
    link.href = this.selectedFormat;
    link.download = this.getFileName(this.selectedFormat);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

getFileName(filePath: string): string {
  return filePath.split('/').pop() || 'descarga';
}
}