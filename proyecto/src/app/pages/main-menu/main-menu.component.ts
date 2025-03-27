import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service'; // ⬅ importa el servicio

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
  currentUser: any = null;
  users: any[] = [];

  constructor(private storage: StorageService) {} // Agrega StorageService

  ngOnInit(): void {
    console.log("MENÚ PRINCIPAL - Verificando primera carga");

    // Verificar si la sesión ya fue iniciada en esta pestaña
    if (!this.storage.getSession('sessionStarted')) {
      console.log("Primera carga detectada -> Eliminando datos de sesión y estableciendo modo invitado.");

      this.storage.clearLocal(); // Borra todo
      this.storage.setLocal('isGuest', JSON.stringify(true)); // Mantiene solo 'isGuest'

      this.storage.setSession('sessionStarted', 'true'); // Marcar que la sesión ya inició

      this.isGuest = true;
      this.isFan = false;
      this.isArtist = false;
      this.currentUser = null;
    } else {
      // Si no es la primera carga, recuperar los datos
      this.loadCurrentUser();
    }
  }

  loadCurrentUser(): void {
    this.currentUser = JSON.parse(this.storage.getLocal('currentUser') || 'null');
    this.users = JSON.parse(this.storage.getLocal('users') || '[]');
    this.isFan = JSON.parse(this.storage.getLocal('isFan') || 'false');
    this.isArtist = JSON.parse(this.storage.getLocal('isArtist') || 'false');
    this.isGuest = !(this.isFan || this.isArtist);
  }

  clearUsers(): void {
    this.storage.removeLocal('users');
    this.storage.removeLocal('currentUser');
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
