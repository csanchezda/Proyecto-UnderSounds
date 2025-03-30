import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modify-song',
  imports: [CommonModule, FormsModule],
  templateUrl: './modify-song.component.html',
  styleUrl: './modify-song.component.css'
})
export class ModifySongComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  audioSrc: string | null = null;
  changeHistory: any[] = [];

  newSong = {
    name: '',
    image: '',
    file: null as File | null,
    duration: '',
    price: ''
  };

  constructor(private router: Router) { }

  triggerFileInput() {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    fileInput.click();
  }
  
  uploadPhoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newSong.image = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  triggerSongInput() {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    fileInput.click();
  }
  
  uploadSong(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const file = input.files[0];
  
      if (file.type.startsWith('audio/')) {
        this.audioSrc = URL.createObjectURL(file);
      } else {
        alert('Por favor, selecciona un archivo de audio válido.');
      }
    }
  }
  
  modifySong() {
    this.router.navigate(['/view-discography']);
  }

  deleteSong() {
    this.router.navigate(['/view-discography']);
  }

  ngOnInit(): void {
    this.loadChanges();
  }

  // Función para cargar los cambios desde un archivo JSON
  loadChanges() {
    fetch('assets/data/ChangeHistory.json')
      .then(response => response.json())
      .then(data => {
        this.changeHistory = data; // Asigna los datos obtenidos al array de cambios
      })
      .catch(error => console.error('Error cargando los cambios:', error));
  }
}
