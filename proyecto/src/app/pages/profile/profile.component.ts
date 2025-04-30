import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  section: string = 'profile';
  selectedOption: string = '';
  followers: any[] = [];
  followings: any[] = [];
  favSongs: any[] = [];
  favAlbums: any[] = [];
  orders: any[] = [];
  selectedUser: any = null;
  selectedUserFollowers: number = 0;
  isFollowing: boolean = false;
  image: string = '';
  newUsername: string = '';
  newPassword: string = '';
  newDescription: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['section']) {
        this.section = params['section'];
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getUserProfile().then(user => {
        this.currentUser = user;
        this.newUsername = user.userName;
        this.newPassword = ''; // nunca recuperes contraseñas reales
        this.newDescription = user.description ?? 'Sin descripción';
        this.loadFollowers();
        this.loadFollowings();
        this.loadFavoriteAlbums();
        this.loadFavoriteSongs();
        this.loadOrders();
      }).catch(err => {
        console.warn('⚠️ Usuario no autenticado. Redirigiendo...');
        this.router.navigate(['/login']);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadFollowers(): void {
    this.http.get<any[]>(`http://localhost:8000/users/${this.currentUser.idUser}/followers`).subscribe({
      next: (followers) => this.followers = followers,
      error: (err) => console.error('Error al cargar seguidores:', err)
    });
  }

  loadFollowings(): void {
    this.http.get<any[]>(`http://localhost:8000/users/${this.currentUser.idUser}/followings`).subscribe({
      next: (followings) => this.followings = followings,
      error: (err) => console.error('Error al cargar followings:', err)
    });
  }

  loadFavoriteAlbums(): void {
    this.http.get<any[]>(`http://localhost:8000/users/${this.currentUser.idUser}/favorite-albums`).subscribe({
      next: (albums) => this.favAlbums = albums,
      error: (err) => console.error('Error al cargar álbumes favoritos:', err)
    });
  }

  loadFavoriteSongs(): void {
    this.http.get<any[]>(`http://localhost:8000/users/${this.currentUser.idUser}/favorite-songs`).subscribe({
      next: (songs) => this.favSongs = songs,
      error: (err) => console.error('Error al cargar canciones favoritas:', err)
    });
  }

  loadOrders(): void {
    this.http.get<any[]>(`http://localhost:8000/users/${this.currentUser.idUser}/orders`).subscribe({
      next: (orders) => {
        this.orders = orders.map(order => ({
          ...order,
          productType: order.isSong ? 'Canción' : 'Álbum'
        }));
      },
      error: (err) => console.error('Error al cargar pedidos:', err)
    });
  }

  logout(): void {
    this.authService.logout();
    alert('Sesión cerrada. Redirigiendo...');
    this.router.navigate(['/main-menu']);
  }

  saveChanges(): void {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (this.newPassword && !passwordRegex.test(this.newPassword)) {
      alert('⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.');
      return;
    }

    const payload = {
      userName: this.newUsername || this.currentUser.userName,
      password: this.newPassword || this.currentUser.password,
      description: this.newDescription,
      profilePicture: this.currentUser.profilePicture
    };

    this.http.put(`http://localhost:8000/users/${this.currentUser.idUser}`, payload).subscribe({
      next: (updated) => {
        alert('Cambios guardados correctamente.');
        this.currentUser = updated;
        this.newUsername = '';
        this.newPassword = '';
        this.newDescription = '';
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        alert('Error al guardar los cambios.');
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('profilePicture', file);

      this.http.post('http://localhost:8000/users/upload', formData).subscribe({
        next: (response: any) => {
          this.currentUser.profilePicture = response.imageUrl;
        },
        error: (err) => {
          console.error('Error al subir imagen:', err);
          alert('Error al subir la imagen.');
        }
      });
    }
  }

  triggerPhotoInput(): void {
    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  changeSection(section: string): void {
    this.section = section;
  }

  viewProfile(user: any): void {
    this.selectedUser = user;
    if (this.section === 'following') this.isFollowing = true;
    else if (this.section === 'followers') this.isFollowing = false;

    this.section = 'user-profile';
  }

  updateFollowers(): void {
    this.isFollowing = !this.isFollowing;
    if (this.isFollowing) {
      this.selectedUserFollowers++;
    } else {
      this.selectedUserFollowers = Math.max(0, this.selectedUserFollowers - 1);
    }
  }

  goToAlbum(albumId: string): void {
    this.router.navigate(['album', albumId]);
  }

  goToSong(songId: string): void {
    this.router.navigate(['/individual-song', songId]);
  }

  goToAlbumArticle(albumId: string): void {
    this.router.navigate([`/shop/albums/${albumId}`]);
  }

  goToSongArticle(songId: string): void {
    this.router.navigate([`/shop/songs/${songId}`]);
  }

  formatArtistName(name: string): string {
    return name.replace(/\s+/g, '-');
  }
}
