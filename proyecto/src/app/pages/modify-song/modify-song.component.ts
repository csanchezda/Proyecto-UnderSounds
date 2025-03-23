import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modify-song',
  imports: [CommonModule],
  templateUrl: './modify-song.component.html',
  styleUrl: './modify-song.component.css'
})
export class ModifySongComponent {
  changes: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadChanges();
  }

  // Función para cargar los cambios desde un archivo JSON
  loadChanges() {
    fetch('assets/data/ChangeHistory.json')
      .then(response => response.json())
      .then(data => {
        this.changes = data; // Asigna los datos obtenidos al array de cambios
      })
      .catch(error => console.error('Error cargando los cambios:', error));
  }
}
