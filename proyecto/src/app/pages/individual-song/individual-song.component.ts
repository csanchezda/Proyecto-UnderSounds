import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Asegúrate de importar Router
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SongService, Song } from '../../services/song.service';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-individual-song',
  imports: [CommonModule, RouterModule],
  templateUrl: './individual-song.component.html',
  styleUrl: './individual-song.component.css'
})

export class IndividualSongComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  song: any;
  songs: any[] = [];
  isPlaying = false;
  progress = 0;
  isLiked = false;
  interval: any;

  constructor(private router: Router, private route: ActivatedRoute, private songService:SongService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      console.log('Cargando canción con id:', id);
      this.loadSongDetails(id);
    });
  }

  loadSongDetails(id: number) {
    this.songService.getSongById(id).subscribe({
      next: (song) => {
        this.song = song;
        console.log('Detalles de la canción:', song);
      },
      error: (err) => {
        console.error('Error al cargar la canción:', err);
        alert('No se pudo cargar la canción.');
        this.router.navigate(['/']);
      }
    });
  }

  formatArtistName(artistName: string): string {
    return artistName.replace(/\s+/g, '-');
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    let favorites: Song[] = JSON.parse(localStorage.getItem('favoriteSongs') || '[]');
  
    if (this.isLiked) {
      favorites.push(this.song);
    } else {
      favorites = favorites.filter(fav => fav.idSong !== this.song.idSong);
    }
  
    localStorage.setItem('favoriteSongs', JSON.stringify(favorites));
  }
  

  togglePlay() {
    const audio = this.audioPlayer.nativeElement

    if (this.isPlaying) {
      audio.pause();
    }
    else {
      audio.play().catch(error => {
        console.error('Error al reproducir el audio:', error);
      });
    }
    this.isPlaying = !this.isPlaying;
  }

  updateProgress(event: Event) {
    const audio = this.audioPlayer.nativeElement;
    this.progress = (audio.currentTime / audio.duration) * 1000 || 0;
  }

  seekAudio(event: Event) {
    const audio = this.audioPlayer.nativeElement;
    const input = event.target as HTMLInputElement;
    const seekTime = (parseFloat(input.value) / 1000) * audio.duration;
    audio.currentTime = seekTime;
  }

  shareSong() {
    const shareUrl = window.location.href;
    alert(`Compartir canción: ${shareUrl}`);
  }

  viewInStore(id: string) {
    this.router.navigate(['/songs', id]);
  }
}
