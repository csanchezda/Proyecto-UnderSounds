import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-song',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-song.component.html',
  styleUrl: './upload-song.component.css'
})
export class UploadSongComponent {
  /*songThumbnail: string = 'assets/images/Rectangle.svg'; // Imagen inicial

  constructor(private router: Router) {}

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.songThumbnail = e.target.result; // Actualiza la URL de la imagen
      };

      reader.readAsDataURL(input.files[0]); // Lee el archivo como una URL base64
    }
  }
*/

@ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

album = {
  name: '',
  image: '',
  description: '',
  price: '',
  songs: [] as { name: string, file: File, duration: string }[]
};

newSong = {
  name: '',
  file: null as File | null,
  duration: ''
};

constructor(private router: Router) {}

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
    this.newSong.file = input.files[0];
    this.getSongDuration(input.files[0]);
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
  if (this.newSong.name && this.newSong.file) {
    this.album.songs.push({
      name: this.newSong.name,
      file: this.newSong.file,
      duration: this.newSong.duration
    });
    this.newSong = { name: '', file: null, duration: '' };
    this.resetFileInput();
  }
}

playSong(file: File) {
  if (this.audioPlayer) {
    const audioUrl = URL.createObjectURL(file);
    this.audioPlayer.nativeElement.src = audioUrl;
    this.audioPlayer.nativeElement.play();
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

createAlbum() {
  this.router.navigate(['/view-discography']);
}
}
