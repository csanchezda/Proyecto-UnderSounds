import { Component, ElementRef,Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
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
  songs: Song[] = [];
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
  

  // Función para cargar los artistas desde un archivo JSON
  loadSongs() {
    this.songService.getAllSongs().subscribe({
      next: (data) => {
        this.songs = data;
      },
      error: (error) => {
        console.error('Error cargando canciones desde el backend:', error);
      }
    })
  }

  goIndividualSong(song:Song) {
    //this.router.navigate(['/individual-song', songId]);
    this.songService.setSelectedSongId(song.idSong);
    this.router.navigate(['/individual-song', song.idSong]);
  }

  goToArtistPage(artistId: number) {
      this.userService.setSelectedArtistId(artistId);
      this.router.navigate(['/artist', artistId]);
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
  
  applyFilters() {
    console.log('Géneros seleccionados:', this.selectedGenres);
    console.log('Rango de años:', this.minYear, 'a', this.maxYear);
    console.log('Rango de duración:', this.minDuration, 'a', this.maxDuration);
    this.toggleFilterPopup();
  
    // Filtrar canciones por duración
    /*const filteredSongs = this.songs.filter(song => 
      song.duration >= this.minDuration && song.duration <= this.maxDuration
    );
    console.log('Canciones filtradas por duración:', filteredSongs);*/


    // Llama al backend con los géneros seleccionados
    this.songService.getAllSongsByGenres(this.selectedGenres).subscribe({
      next: (data) => {
        this.songs = data;
      },
      error: (err) => console.error('Error al filtrar las canciones:', err)
    });
  }
}
