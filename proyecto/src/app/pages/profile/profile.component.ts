import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service'; // ⬅ importa el servicio

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  currentUser: any = null;
  users: any[] = [];

  constructor(
    private router: Router,
    private storage: StorageService // Agrega StorageService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = JSON.parse(this.storage.getLocal('currentUser') || 'null');
    this.users = JSON.parse(this.storage.getLocal('users') || '[]');
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
    this.storage.setLocal('isGuest', JSON.stringify(true));
    alert("Sesión cerrada correctamente. Redirigiendo a la menú principal...");
    this.router.navigate(['/main-menu']);
  }
}
