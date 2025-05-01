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

  async ngOnInit(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.currentUser = await this.authService.getUserProfile();
      this.newUsername = this.currentUser.userName;
      this.newPassword = '';
      this.newDescription = this.currentUser.description ?? 'Sin descripción';

      this.loadFollowers(this.currentUser.idUser);
      this.loadFollowings(this.currentUser.idUser);
      this.loadFavoriteAlbums(this.currentUser.idUser);
      this.loadFavoriteSongs(this.currentUser.idUser);
      this.loadOrders();
    } catch (err) {
      console.warn('⚠️ No se pudo cargar el perfil. Redirigiendo...');
      this.router.navigate(['/login']);
    }
  }

  loadFollowers(userId: number): void {
    this.http.get<any[]>(`http://localhost:8000/users/${userId}/followers`).subscribe({
      next: (followers) => {
        this.followers = followers || [];
        console.log('Seguidores:', this.followers);
      },
      error: (err) => {
        console.error('Error al cargar seguidores:', err);
        this.followers = [];
      }
    });
  }

  loadFollowings(userId: number): void {
    this.http.get<any[]>(`http://localhost:8000/users/${userId}/followings`).subscribe({
      next: (followings) => {
        this.followings = followings || [];
        console.log('Siguiendo a:', this.followings);
      },
      error: (err) => {
        console.error('Error al cargar seguidos:', err);
        this.followings = [];
      }
    });
  }

  loadFavoriteAlbums(userId: number): void {
    this.http.get<any[]>(`http://localhost:8000/users/${userId}/favorite-albums`).subscribe({
      next: (albums) => {
        this.favAlbums = albums || [];
        console.log('Álbumes favoritos:', this.favAlbums);
      },
      error: (err) => {
        console.error('Error al cargar álbumes favoritos:', err);
        this.favAlbums = [];
      }
    });
  }

  loadFavoriteSongs(userId: number): void {
    this.http.get<any[]>(`http://localhost:8000/users/${userId}/favorite-songs`).subscribe({
      next: (songs) => {
        this.favSongs = songs || [];
        console.log('Canciones favoritas:', this.favSongs);
      },
      error: (err) => {
        console.error('Error al cargar canciones favoritas:', err);
        this.favSongs = [];
      }
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
    alert('Sesión cerrada.');
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
        alert('Cambios guardados.');
        this.currentUser = updated;
        this.newUsername = '';
        this.newPassword = '';
        this.newDescription = '';
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('Error al guardar cambios.');
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
          if (response.imageUrl) {
            this.currentUser.image = response.imageUrl;
            console.log('Imagen de perfil actualizada:', this.currentUser.image);
          } else {
            alert('No se pudo obtener la URL de la imagen.');
          }
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

  goToCurrentUserProfile(): void {
    this.selectedUser = null;
    this.loadFollowers(this.currentUser.idUser);
    this.loadFollowings(this.currentUser.idUser);
    this.section = 'profile';
  }
}
