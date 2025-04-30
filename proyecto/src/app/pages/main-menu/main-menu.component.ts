import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent implements OnInit {
  isArtist: boolean = false;
  isFan: boolean = false;
  isGuest: boolean = true;
  users: any[] = [];

  noticias = [
    { img: 'assets/images/img1_menu.jpeg', titulo: 'Nuevo Festival de Música', descripcion: 'Un increíble festival underground se celebrará este verano.' },
    { img: 'assets/images/img2_menu.jpeg', titulo: 'Vinilos en Aumento', descripcion: 'Las ventas de vinilos están alcanzando récords históricos.' },
    { img: 'assets/images/img3_menu.jpeg', titulo: 'Banda Emergente Rompe Récords', descripcion: 'Una banda indie ha conseguido el #1 en las listas de streaming.' },
    { img: 'assets/images/img4_menu.jpeg', titulo: 'Gira Mundial de Banda Legendaria', descripcion: 'Anunciada la gira final de una de las bandas más icónicas.' },
    { img: 'assets/images/img5_menu.jpeg', titulo: 'Streaming para Artistas Underground', descripcion: 'Nueva plataforma para artistas independientes revoluciona la industria.' },
    { img: 'assets/images/img6_menu.jpeg', titulo: 'Explosión del Rock Indie', descripcion: 'El rock indie está resurgiendo con nuevos talentos en la escena.' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log("MENÚ PRINCIPAL - Verificando sesión...");

    if (!this.authService.isLoggedIn()) {
      console.log("No hay token, modo invitado activado.");
      this.setAsGuest();
      return;
    }

    this.authService.getUserProfile().then(user => {
      this.isArtist = this.authService.getIsArtist();
      this.isFan = this.authService.getIsFan();
      this.isGuest = false;
      console.log("Usuario cargado:", user);
    }).catch(err => {
      console.warn("Error al cargar usuario, iniciando como invitado.");
      this.setAsGuest();
    });
  }

  private setAsGuest(): void {
    this.isGuest = true;
    this.isArtist = false;
    this.isFan = false;
  }
}
