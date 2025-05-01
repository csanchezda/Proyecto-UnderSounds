import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlbumService } from '../../services/album.service';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';

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

  constructor(
    private router: Router,
    private albumService: AlbumService,
    private userService: UserService
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

      if (fileExtension === 'mp3') {
        this.newSong.mp3 = file;
      } else if (fileExtension === 'wav') {
        this.newSong.wav = file;
      } else if (fileExtension === 'flac') {
        this.newSong.flac = file;
      } else {
        alert('Formato de archivo no soportado. Por favor, sube un archivo MP3, WAV o FLAC.');
      }

      this.getSongDuration(file);
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
    } else {
      alert('Debes completar al menos el nombre de la canción y el archivo mp3.');
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

  async createAlbum() {
    if (!this.album.name || !this.album.price || !this.album.image) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    let currentUser;
    try {
      currentUser = await firstValueFrom(this.userService.getCurrentUser());
    } catch (err) {
      console.error('❌ No se pudo obtener el usuario autenticado:', err);
      alert('Error al verificar la sesión. Por favor, vuelve a iniciar sesión.');
      return;
    }

    const formData = new FormData();
    formData.append('idUser', currentUser.idUser.toString());
    formData.append('name', this.album.name);
    formData.append('description', this.album.description || 'Sin descripción');
    formData.append('price', this.album.price.toString());
    formData.append('totalDuration', this.calculateTotalDuration());
    formData.append('albumThumbnail', this.album.image);

    let hasValidFormat = false;
    this.album.songs.forEach((song) => {
      if (song.mp3) {
        formData.append('songs', song.mp3);
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
        console.log('✅ Álbum creado exitosamente:', response);
        this.router.navigate(['/view-discography']);
      },
      error: (err) => {
        console.error('❌ Error al crear el álbum:', err);
        alert('Error al crear el álbum.');
      }
    });
  }
}
