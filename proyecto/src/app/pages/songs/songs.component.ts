import { Component, ElementRef,Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SongService, Song } from '../../services/song.service';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSliderModule, RouterModule],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.css'
})
export class SongsComponent {
  allSongs: Song[] = []; //Almacena todas las canciones
  songs: Song[] = []; //Almacena las canciones filtradas
  isPopupOpen: boolean = false;
  genres: string[] = ['Pop', 'Rock', 'Metal', 'Jazz', 'Clásica', 'Hip-Hop', 'Reggaeton', 'Trap', 'Country', 'Electronica'];
  languages: string[] = ['English','Spanish', 'German', 'French'];
  minDuration = 0;
  maxDuration = 10;
  currentYear: number = new Date().getFullYear();
  minYear = 1900;
  maxYear = this.currentYear;
  favoriteSongs: Song[] = [];
  isGuest: boolean = true;
  userId: number | null = null;
  selectedTag:string | null = null;
  selectedGenres: string[] = [];
  searchQuery: string = '';
  durationSliderOptions = {
    floor: 0,
    ceil: 10,
    step: 1,
    translate: (value: number): string => {
      return `${value} min`;
    }
  };
  yearSliderOptions = {
    floor: 1900,
    ceil: this.currentYear,
    translate: (value: number): string => {
      return value.toString();
    }
  };


  constructor(private elementRef: ElementRef, private songService: SongService, private userService: UserService, private authService: AuthService, private router: Router, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.authService.getUserProfile().then(user => {
      this.isGuest = false;
      this.userId = user.idUser;
      this.loadFavoriteSongs(user.idUser);
    }).catch(() => {
      this.isGuest = true;
    });
  
    this.loadSongs();
    this.addHoverEffect();
  }

  loadFavoriteSongs(userId: number): void {
    this.songService.getUserFavoriteSongs(userId).subscribe({
      next: (data) => {
        this.favoriteSongs = data || [];
      },
      error: (error) => {
        console.error('Error cargando canciones favoritas:', error);
        this.favoriteSongs = [];
      }
    });
  }
  

  loadSongs() {
    this.songService.getAllSongs().subscribe({
      next: (data) => {
        this.allSongs = data;
        this.songs = [...this.allSongs];
      },
      error: (error) => {
        console.error('Error cargando canciones desde el backend:', error);
      }
    })
  }

  goIndividualSong(song:Song) {
    this.songService.setSelectedSongId(song.idSong);
    this.router.navigate(['/individual-song', song.idSong]);
  }

  goToArtistPage(artistId: number) {
      this.userService.setSelectedArtistId(artistId);
      this.router.navigate(['/artist', artistId]);
  }

  onSearchChange(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.loadSongs();
      return;
    }

    this.allSongs = this.allSongs.filter(song =>
      song.name.toLowerCase().includes(query)
    );
  }

  convertToSeconds(duration: string | undefined): number {
    if (!duration) return 0;
    const parts = duration.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1]; 
    }
    return Number(duration) || 0; 
  }

  filterByTag(tag: string): void {
    switch(tag) {
      case 'Novedades':
        this.allSongs.sort((a, b) => new Date(b.songReleaseDate).getTime() - new Date(a.songReleaseDate).getTime());
      break;

      case 'Orden alfabético':
        this.allSongs.sort((a, b) => a.name.localeCompare(b.name));
      break;

      case 'Orden por más escuchadas':
        this.allSongs.sort((a, b) => b.views - a.views);
      break;

      case 'Orden por duración': 
      this.allSongs.sort((a, b) => (b.songDuration || 0)  - (a.songDuration || 0)
      );
      break;

      default:
        console.log('Tag no reconocido:', tag);
    }
  }


  selectTag(tag: string): void{
    this.selectedTag = tag;
  }
  
  formatArtistName(artistName: string | undefined): string {
    console.log('Nombre del artista:', artistName);
    if (!artistName) {
      return 'artista-desconocido'; 
    }
    return artistName.replace(/\s+/g, '-'); 
  }

  addHoverEffect() {
    const cards = this.elementRef.nativeElement.querySelectorAll('.song-card h4');
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
  
  applyFiltersPopup(): void {
    console.log('Géneros seleccionados:', this.selectedGenres);
    console.log('Rango de años:', this.minYear, 'a', this.maxYear);
    console.log('Rango de duración:', this.minDuration, 'a', this.maxDuration);
  
    // Filtrar canciones por los criterios seleccionados
    this.songs = this.allSongs.filter(song => {
      const matchesGenre = this.selectedGenres.length === 0 || 
        (song.genre && song.genre.some(genre => this.selectedGenres.includes(genre)));
  
      const matchesDuration = song.songDuration && 
        song.songDuration >= this.minDuration * 60 && 
        song.songDuration <= this.maxDuration * 60;
  
      const matchesYear = song.songReleaseDate && 
        new Date(song.songReleaseDate).getFullYear() >= this.minYear && 
        new Date(song.songReleaseDate).getFullYear() <= this.maxYear;
  
      return matchesGenre && matchesYear;
    });

    this.toggleFilterPopup();
  }
}
