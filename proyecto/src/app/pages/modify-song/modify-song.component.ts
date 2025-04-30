import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SongService, Song } from '../../services/song.service';
import { response } from 'express';

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

  newSong: Song = {
    idSong: 0,
    idUser: 0,
    name: '',
    description: '',
    songDuration: 0,
    price: 0,
    songReleaseDate: new Date(),
    thumbnail: '',
    wav: '',
    flac: '',
    mp3: '',
    views: 0,
    artistName: ''
  };

  constructor(private router: Router, private songService:SongService) { }

  triggerFileInput() {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    fileInput.click();
  }
  
  uploadPhoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newSong.thumbnail = e.target.result;
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
    this.songService.updateSong(this.newSong.idSong, this.newSong).subscribe({
      next:(response) => {
        console.log('Canción modificada:', response);
        alert('Canción modificada con éxito.');
      },
      error: (error) => {
        console.error('❌ Error al modificar la canción:', error);
      }
    })

    this.router.navigate(['/view-discography']);
  }

  deleteSong() {
    this.songService.deleteSong(this.newSong.idSong, this.newSong).subscribe({
      next:(response) => {
        console.log('Canción borrada:', response);
        alert('Canción borrada con éxito');
      },
      error: (error) => {
        console.error('❌ Error al borrar la canción:', error);
      }
    })
    this.router.navigate(['/view-discography']);
  }

  ngOnInit(): void {
    this.loadChanges();
  }

  // Función para cargar los cambios desde un archivo JSON
  loadChanges() {
    fetch('assets/data/ChangeHistorySongs.json')
      .then(response => response.json())
      .then(data => {
        this.changeHistory = data; // Asigna los datos obtenidos al array de cambios
      })
      .catch(error => console.error('Error cargando los cambios:', error));
  }
}
