import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule,  RouterModule,  FormsModule, NgxSliderModule],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent {
  artists: User[] = [];

  isPopupOpen: boolean = false;
  genres: string[] = ['Pop', 'Rock', 'Metal', 'Jazz', 'Clásica', 'Hip-Hop', 'Reggaeton', 'Trap', 'Country', 'Electronica'];
  countries: string[] = [
    'Spain', 'Argentina', 'Mexico', 'Colombia', 'Chile',
    'Peru', 'Venezuela', 'USA', 'UK',
    'France', 'Italy', 'Germany', 'Japan', 'South Korea'
  ];
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

  constructor(private elementRef: ElementRef, private renderer: Renderer2, private userService: UserService) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loadArtists();
  }

  // Método para seleccionar el orden de los artistas
  selectOrder(order: string) {
    this.selectedOrder = order;
  }

  // Método para cargar los artistas desde un archivo JSON
  loadArtists() {
    this.userService.getAllArtists().subscribe({
      next: (data) => {
        console.log('Artistas recibidos:', data); // 👈 pon esto
        this.artists = data;
      },
      error: (error) => {
        console.error('Error cargando artistas desde el backend:', error);
      }
    });
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

  selectedCountries: string[] = [];

  toggleCountrySelection(country: string) {
    if (this.selectedCountries.includes(country)) {
      this.selectedCountries = this.selectedCountries.filter(c => c !== country);
    } else {
      this.selectedCountries.push(country);
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
    this.toggleFilterPopup();

    // Llama al backend con las nacionalidades seleccionadas
    this.userService.getAllArtistsByCountries(this.selectedCountries).subscribe({
      next: (data) => {
        this.artists = data;
      },
      error: (err) => console.error('Error al filtrar artistas:', err)
    });
  }

}
