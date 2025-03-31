import { Component, ElementRef,Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSliderModule, RouterModule],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.css'
})
export class SongsComponent {
  songs: any[] = [];
  isPopupOpen: boolean = false;
  genres: string[] = ['Pop', 'Rock', 'Jazz', 'Classical'];
  languages: string[] = ['English','Spanish', 'German', 'French'];
  duration : number[] = [0, 1, 2, 3, 4, 5, 6, 7 ]; // Duración en minutos
  currentYear: number = new Date().getFullYear();
  minYear = 1900;
  maxYear = this.currentYear;
  selectedTag:string | null = null;
  selectedGenres: string[] = [];
  sliderOptions = {
    floor: 1900,
    ceil: this.currentYear,
    translate: (value: number): string => {
      return value.toString();
    }
  };

  constructor(private elementRef: ElementRef, private router: Router, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.loadSongs();
    this.addHoverEffect();
  }

  // Función para cargar los artistas desde un archivo JSON
  loadSongs() {
    fetch('assets/data/SongsList.json')
      .then(response => response.json())
      .then(data => {
        this.songs = data; // Asigna los datos obtenidos al array de cacniones
      })
      .catch(error => console.error('Error cargando los artistas:', error));
  }
  
  goIndividualSong(songId:number) {
    this.router.navigate(['/individual-song', songId]);
  }

  selectTag(tag: string): void{
    this.selectedTag = tag;
  }
  
  formatArtistName(artistName: string): string {
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
    console.log('Rango de años de nacimiento:', this.minYear, 'a', this.maxYear);
    this.toggleFilterPopup();
  }

}
