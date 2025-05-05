import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlbumService, AlbumUpload } from '../../services/album.service';
import { SongService, SongUpload } from '../../services/song.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-album',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-album.component.html',
  styleUrls: ['./create-album.component.css']
})
export class CreateAlbumComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  album: AlbumUpload = {
    idUser: 0,
    name: '',
    description: '',
    price: 0.0,
    totalDuration: '',
    albumThumbnail: '',
    albumRelDate: new Date(),
    wav: '',
    flac: '',
    mp3: ''
  };

  name: string = '';
  genre: string[] = [];

  newSong: SongUpload[] = [];

  constructor(
    private router: Router,
    private albumService: AlbumService,
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
        this.album.albumThumbnail = e.target.result;
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

      const lastSong = this.newSong[this.newSong.length - 1];
        this.songService.uploadAudio(formData).subscribe({
          next: (response) => {
            lastSong.wav = response.wav;
            lastSong.flac = response.flac;
            lastSong.mp3 = response.mp3;
          },
          error: (error) => {
            console.error('❌ Error al subir la canción:', error);
            alert('Error al subir la canción. Por favor, inténtalo de nuevo.');
          }
        });
    } 
  }

  /*getSongDuration(file: File, index: number) {
    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      const song = this.newSong[index];
      song.songDuration = minutes * 60 + seconds; // Convertimos la duración a segundos como número
    };
  }*/

  addSong(name: string, genre: string[]) {
    const newSong: SongUpload = {
      idUser: 0,
      name: name,
      description: '',
      songDuration: '',
      price: 0,
      songReleaseDate: new Date(),
      thumbnail: '',
      wav: '',
      flac: '',
      mp3: '',
      artistName: '',
      genre: genre
    };
  
    this.newSong.push(newSong);
  }

  playSong(file: File | null) {
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      if (this.audioPlayer) {
        this.audioPlayer.nativeElement.src = audioUrl;
        this.audioPlayer.nativeElement.play();
      }
    } else {
      console.error('El archivo proporcionado no es válido.');
    }
  }

  pauseSong() {
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.pause();
    }
  }

  removeSong(index: number) {
    this.newSong.splice(index, 1);
  }

  resetFileInput() {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /*calculateTotalDuration(): string {
    const totalSeconds = this.newSong.reduce((total, song) => {
      return total + (song.songDuration ?? 0); // Suma directamente los segundos de cada canción
    }, 0);
  
    const totalMinutes = Math.floor(totalSeconds / 60); // Calcula los minutos totales
    const remainingSeconds = totalSeconds % 60; // Calcula los segundos restantes
  
    return `${totalMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`; // Devuelve el tiempo en formato MM:SS
  }*/

  uploadAlbumAudio(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const song = this.newSong[1];
      this.albumService.uploadAudio(formData).subscribe({
        next: (response) => {
          song.wav = response.wav;
          song.flac = response.flac;
          song.mp3 = response.mp3;
        },
        error: (error) => {
          console.error('Error al subir el archivo de audio:', error);
          alert('Hubo un error al subir el archivo de audio. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }

  async createAlbum() {
    if (!this.album.name || !this.album.price || !this.album.albumThumbnail || this.album.price <= 0) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      const user = await this.authService.getUserProfile();
      this.album.idUser = user.idUser;

      /*this.newSong.forEach((song) => {
        this.songService.uploadSongUpdate(song).subscribe({
          error: (error) => {
            console.error('❌ Error al subir la canción:', error);
            alert('Error al subir la canción. Por favor, inténtalo de nuevo.');
          }
        });
      });*/
      this.albumService.uploadAlbum(this.album).subscribe({
        next: (response) => {
          console.log('✅ Álbum creado exitosamente:', response);
          alert('¡Album creado con éxito!');
          this.router.navigate(['/view-discography']);
        },
        error: (err) => {
          console.error('❌ Error al crear el álbum:', err);
          alert('Error al crear el álbum.');
        }
      });

    } catch (error) {
      console.error('No se pudo obtener el perfil del usuario:', error);
      alert('No se pudo obtener tu perfil. Inicia sesión de nuevo.');
      this.router.navigate(['/login']);
    }
  }
}