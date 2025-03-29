import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.css'
})
export class SongsComponent {
  songs: any[] = [];

  constructor(private elementRef: ElementRef, private router: Router) { }

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

  setActive(event: Event) {
    const clickedButton = event.target as HTMLElement; 
    clickedButton.classList.toggle('active');
  }
}
