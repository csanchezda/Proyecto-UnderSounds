import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-menu',
  imports: [CommonModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  isArtist: boolean = false;
  isFan: boolean = false;
  isGuest: boolean = true; // Por defecto, invitado

  ngOnInit() {
    console.log("MENÚ PRINCIPAL");
    // Cargar las variables desde localStorage
    this.isFan = localStorage.getItem('isFan') === 'true';
    this.isArtist = localStorage.getItem('isArtist') === 'true';
    this.isGuest = !this.isFan && !this.isArtist; // Invitado solo si no es fan ni artista
    if (this.isGuest) {
      console.log("Soy INVITADO");
    }
  }

  noticias = [
    { img: 'assets/images/img1_menu.jpeg', titulo: 'Nuevo Festival de Música', descripcion: 'Un increíble festival underground se celebrará este verano.' },
    { img: 'assets/images/img2_menu.jpeg', titulo: 'Vinilos en Aumento', descripcion: 'Las ventas de vinilos están alcanzando récords históricos.' },
    { img: 'assets/images/img3_menu.jpeg', titulo: 'Banda Emergente Rompe Récords', descripcion: 'Una banda indie ha conseguido el #1 en las listas de streaming.' },
    { img: 'assets/images/img4_menu.jpeg', titulo: 'Gira Mundial de Banda Legendaria', descripcion: 'Anunciada la gira final de una de las bandas más icónicas.' },
    { img: 'assets/images/img5_menu.jpeg', titulo: 'Streaming para Artistas Underground', descripcion: 'Nueva plataforma para artistas independientes revoluciona la industria.' },
    { img: 'assets/images/img6_menu.jpeg', titulo: 'Explosión del Rock Indie', descripcion: 'El rock indie está resurgiendo con nuevos talentos en la escena.' }
  ];
}
