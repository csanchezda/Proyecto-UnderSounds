import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.css'
})
export class SongsComponent {
  songs: any[] = [];

  constructor() { }

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
}
