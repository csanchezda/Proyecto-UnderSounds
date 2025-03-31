import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

newSong = {
  name: '',
  image: '',
  file: null as File | null,
  duration: '',
  price: ''
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

createSong() {
  this.router.navigate(['/view-discography']);
}
}
