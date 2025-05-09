import { Component, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modify-album',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modify-album.component.html',
  styleUrl: './modify-album.component.css'
})
export class ModifyAlbumComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  changeHistory: any[] = [];

  album = {
    name: '',
    image: '',
    description: '',
    genre: '',
    price: 0,
    songs: [] as { name: string, file: File, duration: string, genre: string }[]
  };

  newSong = {
    file: null as File | null,
    name: '',
    genre: '',
    duration: ''
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadChangeHistory();
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
        file: this.newSong.file,
        name: this.newSong.name,
        genre: this.newSong.genre,
        duration: this.newSong.duration
      });
      this.newSong = { file: null, name: '', genre: '', duration: '' };
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

  modifyAlbum() {
    this.router.navigate(['/view-discography']);
  }

  deleteAlbum() {
    this.router.navigate(['/view-discography']);
  }

  loadChangeHistory() {
    fetch('assets/data/ChangeHistoryAlbums.json')
      .then(response => response.json())
      .then(data => {
        this.changeHistory = data;
      })
      .catch(error => console.error('Error cargando el historial de cambios:', error));
  }
}
