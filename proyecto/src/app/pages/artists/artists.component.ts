import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service'; // Asegúrate de importar el servicio de autenticación
import { debounceTime } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';

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
  selectedOrder: string = ''; // Orden por defecto
  hasResults: boolean = true; // Por defecto, asumimos que hay resultados
  isGuest: boolean = false; // Variable para verificar si el usuario es un invitado
  followedArtists: User[] = [];
  userId: number | null = null;
  
  // Array para almacenar los géneros seleccionados
  selectedGenres: string[] = [];
  constructor(private elementRef: ElementRef, private renderer: Renderer2, private userService: UserService, private router: Router, private authService: AuthService,   private cdr: ChangeDetectorRef
  ) { }

  searchTerm: string = '';
private searchSubject = new Subject<string>();

ngOnInit(): void {
  this.authService.getUserProfile().then(user => {
    this.isGuest = false;
    this.userId = user.idUser;
    this.loadFollowedArtists();
  }).catch(() => {
    this.isGuest = true;
  });

  this.loadArtists();

  // Escuchar los cambios de búsqueda con debounce
  this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
    this.performSearch(term);
  });
}

onSearchTermChange(term: string) {
  this.searchTerm = term;

  const trimmed = term.trim();

  if (trimmed === '') {
    this.loadArtists();        
    this.hasResults = true;    
    return;
  }

  this.searchSubject.next(trimmed);  // continúa con la búsqueda
}



private performSearch(term: string) {
  // Mapear el texto del botón al valor esperado por el backend
  let orderParam: string | undefined;

  switch (this.selectedOrder) {
    case 'Orden alfabético':
      orderParam = 'name';
      break;
    case 'Orden por más escuchados':
      orderParam = 'views';
      break;
    case 'Más Seguidos':
      orderParam = 'followers';
      break;
    default:
      orderParam = undefined;
  }

  this.userService.getFilteredArtists(term, orderParam).subscribe({
    next: (data) => {
      this.artists = data;
      this.cdr.detectChanges();
      this.hasResults = data.length > 0;
    },
    error: (err) => {
      console.error('Error al buscar artistas:', err);
      this.hasResults = false;
    }
  });
}




  
  loadFollowedArtists(): void {
    if (this.userId !== null) {
      this.userService.getFollowedArtists(this.userId).subscribe({
        next: (data) => {
          this.followedArtists = data;
          this.hasResults = this.followedArtists.length > 0;
        },
        error: (error) => {
          console.error('Error cargando artistas seguidos:', error);
          this.hasResults = false;
        }
      });
    }
  }
  

  // Método para seleccionar el orden de los artistas
  selectOrder(orderLabel: string) {
    this.selectedOrder = orderLabel;
  
    // Traducir a claves válidas para el backend
    let orderParam: string | undefined;
  
    switch (orderLabel) {
      case 'Orden alfabético':
        orderParam = 'name';
        break;
      case 'Orden por más escuchados':
        orderParam = 'views';
        break;
      case 'Más Seguidos':
        orderParam = 'followers';
        break;
      default:
        orderParam = undefined;
    }
  
    const trimmed = this.searchTerm.trim();
    this.userService.getFilteredArtists(trimmed || undefined, orderParam).subscribe({
      next: (data) => {
        this.artists = data;
        this.cdr.detectChanges();
        this.hasResults = data.length > 0;
      },
      error: (err) => {
        console.error('Error al aplicar orden:', err);
        this.hasResults = false;
      }
    });
  }
  
  
  

  loadArtists() {
    this.userService.getAllArtists().subscribe({
      next: (data) => {
        this.artists = data;
        this.hasResults = data.length > 0;
        console.log('Respuesta del backend:', data);

      },
      error: (error) => {
        console.error('Error cargando artistas desde el backend:', error);
        this.hasResults = false; 
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
  
    const countries = this.selectedCountries;
    const genres = this.selectedGenres;
  
    if (countries.length === 0 && genres.length === 0) {
      this.loadArtists();
      return;
    }
  
    this.userService.filterArtistsByCountryAndGenre(countries, genres).subscribe({
      next: (data) => {
        this.artists = data;
        this.cdr.detectChanges();
        this.hasResults = data.length > 0;
      },
      error: (err) => {
        console.error('❌ Error al aplicar filtros combinados:', err);
        this.hasResults = false;
      }
    });
  }
  


  goToArtistPage(artist: User) {
    this.userService.setSelectedArtistId(artist.idUser);
    this.router.navigate(['/artist', this.formatArtistName(artist.name)]);
  }
  
}