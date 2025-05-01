import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SongService, SongUpload } from '../../services/song.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-upload-song',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.css']
})
export class UploadSongComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  audioSrc: string | null = null;

  newSong: SongUpload = {
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
    artistName: '',
    genre: []
  };

  constructor(
    private router: Router,
    private songService: SongService,
    private authService: AuthService
  ) {}

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
      const formData = new FormData();
      formData.append('file', file);

      this.songService.uploadAudio(formData).subscribe({
        next: (response) => {
          this.newSong.wav = response.wav;
          this.newSong.flac = response.flac;
          this.newSong.mp3 = response.mp3;
        },
        error: (error) => {
          console.error('Error al subir el archivo de audio:', error);
          alert('Hubo un error al subir el archivo de audio. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }

  onGenreChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedGenre = selectElement.value;

    if (selectedGenre) {
      this.newSong.genre = [selectedGenre];
    } else {
      alert('Por favor, selecciona un género.');
    }
  }

  async createSong() {
    console.log('Subiendo canción:', this.newSong);

    if (!this.newSong.name) {
      alert('Por favor, introduce el nombre de la canción.');
      return;
    }

    if (!this.newSong.thumbnail) {
      alert('Por favor, sube una imagen para la canción.');
      return;
    }

    if (!this.newSong.genre?.length) {
      alert('Por favor, selecciona un género.');
      return;
    }

    if (!this.newSong.price || this.newSong.price <= 0) {
      alert('Por favor, introduce un precio válido para la canción.');
      return;
    }

    if (!this.newSong.wav || !this.newSong.flac || !this.newSong.mp3) {
      alert('Por favor, sube un archivo de audio antes de continuar.');
      return;
    }

    try {
      const user = await this.authService.getUserProfile();
      this.newSong.idUser = user.idUser;

      this.songService.uploadSongUpdate(this.newSong).subscribe({
        next: (response) => {
          console.log('Canción subida:', response);
          alert('¡Canción subida con éxito!');
          this.router.navigate(['/view-discography']);
        },
        error: (error) => {
          console.error('Error al subir la canción:', error);
          alert('Hubo un error al subir la canción. Por favor, inténtalo de nuevo.');
        }
      });
    } catch (error) {
      console.error('No se pudo obtener el perfil del usuario:', error);
      alert('No se pudo obtener tu perfil. Inicia sesión de nuevo.');
      this.router.navigate(['/login']);
    }
  }
}
