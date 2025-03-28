import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule,  RouterModule,  FormsModule, NgxSliderModule],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent {
  artists: any[] = [];

  isPopupOpen: boolean = false;
  genres: string[] = ['Pop', 'Rock', 'Jazz', 'Classical'];
  countries: string[] = ['USA', 'UK', 'Spain', 'Germany'];
  currentYear: number = new Date().getFullYear();

  minYear = 1900;
  maxYear = this.currentYear;
  sliderOptions = {
    floor: 1900,
    ceil: this.currentYear,
    translate: (value: number): string => {
      return value.toString();
    }
  };

  selectedGenres: string[] = [];

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.loadArtists();
  }

  // Función para cargar los artistas desde un archivo JSON
  
  loadArtists() {
    fetch('assets/data/ArtistsList.json')
      .then(response => response.json())
      .then(data => {
        this.artists = data; // Asigna los datos obtenidos al array de artistas
      })
      .catch(error => console.error('Error cargando los artistas:', error));
  }
  // Función para formatear el nombre del artista
  formatArtistName(artistName: string): string {
    return artistName.replace(/\s+/g, '-'); // Reemplaza los espacios por guiones
}

toggleFilterPopup() {
  this.isPopupOpen = !this.isPopupOpen;

  if (this.isPopupOpen) {
    const button = this.elementRef.nativeElement.querySelector('.filter-icon');
    const popup = this.elementRef.nativeElement.querySelector('.filter-popup');

    const rect = button.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;

    this.renderer.setStyle(popup, 'top', `${top}px`);
    this.renderer.setStyle(popup, 'left', `${left}px`);
  }
}

toggleGenreSelection(genre: string) {
  if (this.selectedGenres.includes(genre)) {
    this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
  } else {
    this.selectedGenres.push(genre);
  }
}

removeGenre(genre: string, event: Event) {
  event.stopPropagation();
  this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
}

applyFilters() {
  console.log('Géneros seleccionados:', this.selectedGenres);
  console.log('Rango de años de nacimiento:', this.minYear, 'a', this.maxYear);
  this.toggleFilterPopup();
}

}