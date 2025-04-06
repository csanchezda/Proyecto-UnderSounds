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
  selectedOrder: string = ''; // Orden por defecto
  minYear = 1900;
  maxYear = this.currentYear;

  // Configuración del slider para el rango
  sliderOptions = {
    floor: 1900,
    ceil: this.currentYear,
    translate: (value: number): string => {
      return value.toString();
    }
  };

  // Array para almacenar los géneros seleccionados
  selectedGenres: string[] = [];

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loadArtists();
  }

  // Método para seleccionar el orden de los artistas
  selectOrder(order: string) {
    this.selectedOrder = order;
  }

  loadArtists() {
    fetch('http://localhost:8000/artists')
      .then(response => response.json())
      .then(data => {
        this.artists = data;
      })
      .catch(error => console.error('Error cargando los artistas desde el backend:', error));
  }
  

  // Método para formatear el nombre del artista
  formatArtistName(artistName: string): string {
    return artistName.replace(/\s+/g, '-'); // Reemplaza los espacios por guiones
  }

  // Método para abrir y cerrar el popup de filtros
  toggleFilterPopup() {
    this.isPopupOpen = !this.isPopupOpen;

    if (this.isPopupOpen) {
      const button = this.elementRef.nativeElement.querySelector('.btn:first-child'); // Selecciona el primer botón que es "Novedades"
      const popup = this.elementRef.nativeElement.querySelector('.filter-popup');

      const rect = button.getBoundingClientRect();
      const top = rect.top + window.scrollY; 
      const left = rect.left + window.scrollX;

      this.renderer.setStyle(popup, 'top', `${top}px`);
      this.renderer.setStyle(popup, 'left', `${left}px`);

      // Ajusta el translate si es necesario
      this.renderer.setStyle(popup, 'transform', 'translateY(0)');
    }
  }

  // Métdo para cargar los géneros desde un archivo JSON
  toggleGenreSelection(genre: string) {
    if (this.selectedGenres.includes(genre)) {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    } else {
      this.selectedGenres.push(genre);
    }
  }

  // Método para verificar si un género está seleccionado
  removeGenre(genre: string, event: Event) {
    event.stopPropagation();
    this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
  }

  // Método para aplicar los filtros seleccionados
  applyFilters() {
    this.toggleFilterPopup();
  }

}