import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlbumService, Album } from '../../services/album.service';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-create-album',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-album.component.html',
  styleUrls: ['./create-album.component.css']
})
export class CreateAlbumComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  album = {
    name: '',
    image: '',
    description: '',
    genre: '',
    price: 0,
    songs: [] as { name: string, mp3: File | null, wav: File | null, flac: File | null, duration: string, genre: string, price: number }[]
  };

  newSong = {
    mp3: null as File | null,
    wav: null as File | null,
    flac: null as File | null,
    name: '',
    genre: '',
    duration: '',
    price: 0.0
  };

  constructor(private router: Router, private albumService: AlbumService, private userService: UserService) {}

  triggerFileInput() {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    fileInput.click();
  }

  uploadPhoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.album.image = e.target.result;
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
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
      // Asignar el archivo al formato correspondiente
      if (fileExtension === 'mp3') {
        this.newSong.mp3 = file;
      } else if (fileExtension === 'wav') {
        this.newSong.wav = file;
      } else if (fileExtension === 'flac') {
        this.newSong.flac = file;
      } else {
        alert('Formato de archivo no soportado. Por favor, sube un archivo MP3, WAV o FLAC.');
      }
    }
  }

  getSongDuration(file: File) {
    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      this.newSong.duration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
  }

  addSong() {
    if (this.newSong.name && this.newSong.mp3) {
      this.album.songs.push({
        name: this.newSong.name,
        mp3: this.newSong.mp3,
        wav: this.newSong.wav,
        flac: this.newSong.flac,
        duration: this.newSong.duration,
        genre: this.newSong.genre,
        price: this.newSong.price
      });
      this.newSong = { mp3: null, wav: null, flac: null, name: '', genre: '', duration: '', price: 0 };
      this.resetFileInput();
    }
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
    this.album.songs.splice(index, 1);
    this.resetFileInput();
  }

  resetFileInput() {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  calculateTotalDuration(): string {
    const totalSeconds = this.album.songs.reduce((total, song) => {
      const [minutes, seconds] = song.duration.split(':').map(Number);
      return total + minutes * 60 + seconds;
    }, 0);
  
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
  
    return `${totalMinutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  createAlbum() {
    if (!this.album.name || !this.album.price || !this.album.image) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
  
    const formData = new FormData();
    const currentUserId = this.userService.getCurrentUserId() || 11; // Reemplaza con el ID del usuario actual si es necesario
    formData.append('idUser', currentUserId.toString());
    formData.append('name', this.album.name);
    formData.append('description', this.album.description || 'Sin descripción');
    formData.append('price', this.album.price.toString());
    formData.append('totalDuration', this.calculateTotalDuration());
    formData.append('albumThumbnail', this.album.image);
  
    // Agregar archivos de canciones al formulario bajo la misma clave "songs"
    let hasValidFormat = false;
    this.album.songs.forEach((song) => {
      if (song.mp3) {
        formData.append('songs', song.mp3); // Clave "songs" para todos los archivos
        hasValidFormat = true;
      }
      if (song.wav) {
        formData.append('songs', song.wav);
        hasValidFormat = true;
      }
      if (song.flac) {
        formData.append('songs', song.flac);
        hasValidFormat = true;
      }
    });
  
    if (!hasValidFormat) {
      alert('Por favor, sube al menos un archivo en formato mp3, wav o flac.');
      return;
    }
  
    this.albumService.createAlbumWithSongs(formData).subscribe({
      next: (response) => {
        console.log('Álbum creado exitosamente:', response);
        this.router.navigate(['/view-discography']);
      },
      error: (err) => {
        console.error('Error al crear el álbum:', err);
      }
    });
  }
}
