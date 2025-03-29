import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  songThumbnail: string = 'assets/images/Rectangle.svg'; // Imagen por defecto

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

  uploadSong() {
    this.router.navigate(['/view-discography']);
  }
}
