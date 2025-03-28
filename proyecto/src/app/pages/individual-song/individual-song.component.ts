import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-individual-song',
  imports: [CommonModule],
  templateUrl: './individual-song.component.html',
  styleUrl: './individual-song.component.css'
})

export class IndividualSongComponent implements OnInit {
  song: any;
  isPlaying = false;
  progress = 0;
  isLiked = false;
  interval: any;

  constructor(private route: ActivatedRoute) {}

  loadSongDetails(songId: string | null) {
    if (songId) {
      fetch('assets/data/SongsList.json')
        .then(response => response.json())
        .then(data => {
          this.song = data.find((s: any) => s.id.toString() === songId);
        })
        .catch(error => console.error('Error al cargar la canción:', error));
    }
  }

  ngOnInit(): void {
    const songId = this.route.snapshot.paramMap.get('id');
    this.loadSongDetails(songId);
  }
  
  toggleLike() {
    this.isLiked = !this.isLiked;
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.startProgress();
    } 
    else {
      this.stopProgress();
    }
  }

  startProgress() {
    this.interval = setInterval(() => {
      if (this.progress < 1000) {
        this.progress ++;
      }
      else {
        this.stopProgress();
        this.isPlaying = false;
      }
    }); 
  }

  stopProgress() {
    clearInterval(this.interval);
  }

}
