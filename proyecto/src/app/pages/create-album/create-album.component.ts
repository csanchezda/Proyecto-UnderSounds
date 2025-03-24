import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-album.component.html',
  styleUrls: ['./create-album.component.css']
})
export class CreateAlbumComponent {
  album = {
    name: '',
    image: ''
  };

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
}
