import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  currentUser: any = null;
  users: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
  }

  updateUserData(updatedUser: any): void {
    this.currentUser = updatedUser;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

    const userIndex = this.users.findIndex(user => user.username === updatedUser.username);
    if (userIndex !== -1) {
      this.users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  logout(): void {
    console.log("Cerrando sesión...");
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isFan');
    localStorage.removeItem('isArtist');
    localStorage.setItem('isGuest', JSON.stringify(true));
    alert("Sesión cerrada correctamente. Redirigiendo a la menú principal...");
    this.router.navigate(['/main-menu']);
  }
}
