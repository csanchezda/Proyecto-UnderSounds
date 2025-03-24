import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service'; // ⬅ importa el servicio

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  currentUser: any = null;
  users: any[] = [];
  usersList: any[] = [];

  constructor(private router: Router, private storage: StorageService ) {} // Agrega StorageService
   
  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = JSON.parse(this.storage.getLocal('currentUser') || 'null');
    this.users = JSON.parse(this.storage.getLocal('users') || '[]');
  }

  loadFollowers(){
    fetch('assets/data/Users.json')
    .then(response => response.json())
    .then(data => {
      this.usersList = data; // Asigna los datos obtenidos al array de cacniones
    })
    .catch(error => console.error('Error cargando los seguidores:', error));
  }

  updateUserData(updatedUser: any): void {
    this.currentUser = updatedUser;
    this.storage.setLocal('currentUser', JSON.stringify(this.currentUser));

    const userIndex = this.users.findIndex(user => user.username === updatedUser.username);
    if (userIndex !== -1) {
      this.users[userIndex] = updatedUser;
      this.storage.setLocal('users', JSON.stringify(this.users));
    }
  }

  logout(): void {
    console.log("Cerrando sesión...");
    this.storage.removeLocal('currentUser');
    this.storage.removeLocal('isFan');
    this.storage.removeLocal('isArtist');
    this.storage.removeLocal('users');
    this.storage.removeLocal('usersList');
    this.storage.setLocal('isGuest', JSON.stringify(true));
    alert("Sesión cerrada correctamente. Redirigiendo a la menú principal...");
    this.router.navigate(['/main-menu']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file.name);
    }
  }
}
