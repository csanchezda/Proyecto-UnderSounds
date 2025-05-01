import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SongService, Song, SongUpdate } from '../../services/song.service';
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
  updateId: number | null = null;

  newSong: SongUpdate = {
    thumbnail: '',
    name: '',
    wav: '',
    flac: '',
    mp3: '',
    genre: [],
    price: 0
  }
  
  constructor(private router: Router, private route: ActivatedRoute, private songService:SongService) { }
  
  ngOnInit(): void {
    this.updateId =Number(this.route.snapshot.paramMap.get('id'));
    if(!this.updateId) {
      alert('No se ha encontrado el id de la canción a modificar.');
      this.router.navigate(['/view-discography']);
    }
    this.loadChanges();
    this.loadSong();
  }

  loadSong() {
    if(!this.updateId) return;

    this.songService.getSongById(this.updateId).subscribe({
      next: (song) => {
        this.newSong = {
          thumbnail: song.thumbnail,
          name: song.name,
          wav: song.wav,
          flac: song.flac,
          mp3: song.mp3,
          genre: song.genre ? (Array.isArray(song.genre) ? song.genre : [song.genre]) : [],
          price: song.price
        }
      },
      error: (error) => {
        console.error('Error cargando la canción:', error);
        alert('Error al cargar la canción. Por favor, inténtelo de nuevo más tarde.');
        this.router.navigate(['/view-discography']);
      }
    })
  }

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
    if (!this.updateId) {
      console.error('No se puede modificar la canción porque no se encontró el ID.');
      return;
    }
    console.log('Datos enviados al backend:', this.newSong);
    this.songService.updateSong(this.updateId, this.newSong).subscribe({
      next:(response) => {
        console.log('Canción modificada:', response);
        alert('Canción modificada con éxito.');
        this.router.navigate(['/view-discography']);
      },
      error: (error) => {
        console.error('❌ Error al modificar la canción:', error);
      }
    });
  }

  deleteSong() {
    this.songService.deleteSong(this.updateId).subscribe({
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
