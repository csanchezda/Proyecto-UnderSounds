import { Component } from '@angular/core';
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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadSongs();
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
}
