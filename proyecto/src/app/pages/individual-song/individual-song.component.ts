import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-individual-song',
  imports: [],
  templateUrl: './individual-song.component.html',
  styleUrl: './individual-song.component.css'
})

export class IndividualSongComponent implements OnInit {
  song: any;

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
}
