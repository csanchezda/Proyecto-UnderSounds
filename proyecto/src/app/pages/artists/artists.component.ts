import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent {
  artists: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadArtists();
  }

  // Función para cargar los artistas desde un archivo JSON
  loadArtists() {
    fetch('assets/images/artists/artists.json')
      .then(response => response.json())
      .then(data => {
        this.artists = data; // Asigna los datos obtenidos al array de artistas
      })
      .catch(error => console.error('Error cargando los artistas:', error));
  }
}
