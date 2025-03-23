import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSliderModule, RouterModule],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {
  album: any;
  albums: any[] = []; // Para evitar errores, usa `any` si no deseas una interfaz
  isFavorite: boolean = false;
  isPopupOpen: boolean = false;
  genres: string[] = ['Pop', 'Rock', 'Jazz', 'Classical'];
  languages: string[] = ['English', 'Spanish', 'German', 'French'];
  currentYear: number = new Date().getFullYear();

  minDuration = 0;
  maxDuration = 100;
  durationOptions = {
    floor: 0,
    ceil: 100,
    translate: (value: number): string => {
      return `${value} min`;
    }
  };

  minReleaseYear = 1900;
  maxReleaseYear = this.currentYear;
  sliderOptions = {
    floor: 1900,
    ceil: this.currentYear,
    translate: (value: number): string => {
      return value.toString();
    }
  };

  selectedGenres: string[] = [];

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadAlbums();
    this.addHoverEffect();
  }

  loadAlbums() {
    fetch('assets/data/AlbumsList.json') // Ruta al archivo JSON
      .then(response => response.json())
      .then(data => {
        this.albums = data.map((album: { id: any; Artist: any; Name: any; Duration: any; image: any; }) => ({
          id: album.id,
          Artist: album.Artist,
          Name: album.Name,
          Duration: album.Duration,
          image: album.image
        }));
      })
      .catch(error => console.error('Error cargando los álbumes:', error));
  }

  addHoverEffect() {
    const cards = this.elementRef.nativeElement.querySelectorAll('.album-card h4');
    cards.forEach((card: HTMLElement) => {
      card.addEventListener('mouseover', () => {
        card.classList.add('scrolling-text');
      });

      card.addEventListener('mouseout', () => {
        card.classList.remove('scrolling-text');
      });
    });
  }

  toggleFilterPopup() {
    this.isPopupOpen = !this.isPopupOpen;

    if (this.isPopupOpen) {
      const button = this.elementRef.nativeElement.querySelector('.filter-icon');
      const popup = this.elementRef.nativeElement.querySelector('.filter-popup');

      const rect = button.getBoundingClientRect();
      const top = rect.top + window.scrollY + 230; 
      const left = rect.right + window.scrollX + 170;

      this.renderer.setStyle(popup, 'top', '${top}px');
      this.renderer.setStyle(popup, 'left', '${left}px');
    }
  }

  toggleGenreSelection(genre: string) {
    if (this.selectedGenres.includes(genre)) {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    } else {
      this.selectedGenres.push(genre);
    }
  }
    formatArtistName(artistName: string): string {
      return artistName.replace(/\s+/g, '-'); // Reemplaza los espacios por guiones
  }

  removeGenre(genre: string, event: Event) {
    event.stopPropagation();
    this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
  }

  applyFilters() {
    console.log('Géneros seleccionados:', this.selectedGenres);
    console.log('Duración: ', this.minDuration, 'a', this.maxDuration, 'minutos');
    console.log('Rango de años de lanzamiento:', this.minReleaseYear, 'a', this.maxReleaseYear);
    this.toggleFilterPopup();
  }
}