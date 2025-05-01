import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  currentUser: any = null;
  users: any[] = [];
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
    private storage: StorageService,
    private r: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.r.queryParams.subscribe(params => {
      if (params['section']) {
        this.section = params['section'];
      }
    });
  }

  ngOnInit(): void {
    this.authService.getUserProfile().then(user => {
      this.currentUser = user;
      this.loadUserProfileData(user.idUser);
    }).catch(err => {
      console.error('Error al obtener el perfil', err);
      this.router.navigate(['/login']);
    });
  }
  

  registerUser(user:any): void {
    const users = JSON.parse(this.storage.getLocal('users') || '[]');
    users.push(user);
    this.storage.setLocal('users', JSON.stringify(users));
    this.storage.setLocal('currentUser', JSON.stringify(user));
  }

  loadCurrentUser(): void {
    this.currentUser = JSON.parse(this.storage.getLocal('currentUser') || 'null');
    if (this.currentUser) {
      //Inicializa las variables de usuario
      this.currentUser.username = this.currentUser.username;
      this.currentUser.followers = this.currentUser.followers;
      this.currentUser.description = this.currentUser.description || "Sin descripción";
      this.currentUser.image = this.currentUser.profilePicture;

      // Inicializa las variables temporales
      this.newUsername = this.currentUser.username;
      this.newPassword = this.currentUser.password;
      this.newDescription = this.currentUser.description;
    }
    this.users = JSON.parse(this.storage.getLocal('users') || '[]');
  }

  loadFollowers(userId: number): void {
    this.http.get<any[]>(`http://localhost:8000/users/${userId}/followers`).subscribe({
        next: (followers) => {
            if (followers && followers.length > 0) {
                this.followers = followers || [];
                console.log('Seguidores cargados desde el backend:', this.followers);
            } else {
                console.log('El usuario no tiene seguidores.');
                this.followers = [];
            }
        },
        error: (err) => {
            console.error('Error al cargar los seguidores:', err);
            this.followers = [];
        }
    });
  }

  loadFollowings(userId: number): void {
    this.http.get<any[]>(`http://localhost:8000/users/${userId}/followings`).subscribe({
        next: (followings) => {
            if (followings && followings.length > 0) {
                this.followings = followings || [];
                console.log('Usuarios seguidos cargados desde el backend:', this.followings);
            } else {
                console.log('El usuario no sigue a nadie.');
                this.followings = [];
            }
        },
        error: (err) => {
            console.error('Error al cargar los usuarios seguidos:', err);
            this.followings = [];
        }
    });
  }

  loadFavoriteAlbums(userId: number): void {
    this.http.get<any[]>(`http://localhost:8000/users/${userId}/favorite-albums`).subscribe({
        next: (albums) => {
            if (albums && albums.length > 0) {
                this.favAlbums = albums || [];
                console.log('Álbumes favoritos cargados desde el backend:', this.favAlbums);
            } else {
              console.log('El usuario no tiene álbumes favoritos.');
              this.favAlbums = [];
          }
        },
        error: (err) => {
            console.error(`Error al cargar los álbumes favoritos:`, err);
            this.favAlbums = [];
        }
    });
  }

  loadFavoriteSongs(userId: number): void {
    this.http.get<any[]>(`http://localhost:8000/users/${userId}/favorite-songs`).subscribe({
        next: (songs) => {
          if (songs && songs.length > 0) {
            this.favSongs = songs || [];
            console.log('Álbumes favoritos cargados desde el backend:', this.favSongs);
          } else {
            console.log('El usuario no tiene álbumes favoritos.');
            this.favSongs = [];
          }
        },
        error: (err) => {
            console.error(`Error al cargar las canciones favoritas:`, err);
            this.favSongs = [];
        }
    });
  }

  loadOrders(): void {
      this.http.get<any[]>(`http://localhost:8000/users/${this.currentUser.idUser}/orders`).subscribe({
          next: (orders) => {
              this.orders = orders.map(order => {
                  return {
                      ...order,
                      productType: order.isSong ? 'Canción' : 'Álbum'
                  };
              });
              console.log('Pedidos cargados desde el backend:', this.orders);
          },
          error: (err) => {
              console.error('Error al cargar los pedidos:', err);
          }
      });
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
    this.authService.logout();
  }
  

  saveChanges() {
    // Validación de la contraseña solo si se proporciona una nueva
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (this.newPassword.trim() !== '' && !passwordRegex.test(this.newPassword)) {
      alert('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.');
      return;
    }
  
    // Si el campo de nombre está vacío, usa el valor actual
    this.newUsername = this.newUsername.trim() !== '' ? this.newUsername : this.currentUser.username;
  
    // Si el campo de contraseña está vacío, usa el valor actual
    this.newPassword = this.newPassword.trim() !== '' ? this.newPassword : this.currentUser.password;

    // Actualiza los valores en currentUser
    this.currentUser.username = this.newUsername;
    this.currentUser.password = this.newPassword;
    this.currentUser.description = this.newDescription;

    console.log('Datos enviados al backend:', {
      name: this.currentUser.username,
      password: this.currentUser.password,
      description: this.currentUser.description,
      profilePicture: this.currentUser.image
    });
  
    this.http.put(`http://localhost:8000/users/${this.currentUser.idUser}`, {
      name: this.currentUser.username,
      password: this.currentUser.password,
      description: this.currentUser.description,
      profilePicture: this.currentUser.image
    }).subscribe({
      next: (response: any) => {
        alert('Cambios guardados correctamente.');
        console.log('Usuario actualizado:', response);
  
        // Actualiza el usuario actual con los datos enviados
        this.currentUser = response;
        this.storage.setLocal('currentUser', JSON.stringify(this.currentUser));
  
        // Limpia los campos de entrada
        this.newUsername = '';
        this.newPassword = '';
        this.newDescription = '';
      },
      error: (err) => {
        console.error('Error al guardar los cambios:', err);
        alert('Hubo un error al guardar los cambios. Inténtalo de nuevo.');
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];

        // Crea un FormData para enviar el archivo al servidor
        const formData = new FormData();
        formData.append('profilePicture', file);

        // Envía el archivo al servidor
        this.http.post('http://localhost:8000/users/upload', formData).subscribe({
            next: (response: any) => {
                console.log('Respuesta del servidor al subir la imagen:', response);
                if (response.imageUrl) {
                    console.log('Imagen subida correctamente:', response.imageUrl);

                    // Actualiza la imagen en currentUser con la URL proporcionada por el servidor
                    this.currentUser.image = response.imageUrl;

                    // Guarda el usuario actualizado en localStorage
                    this.storage.setLocal('currentUser', JSON.stringify(this.currentUser));

                    console.log('Imagen actualizada en currentUser:', this.currentUser.image);
                } else {
                    console.error('La respuesta del servidor no contiene imageUrl:', response);
                    alert('Error: No se pudo obtener la URL de la imagen.');
                }
            },
            error: (err) => {
                console.error('Error al subir la imagen:', err);
                alert('Hubo un error al subir la imagen. Inténtalo de nuevo.');
            }
        });
    } else {
        console.error('No se seleccionó ningún archivo.');
    }
  }

  triggerPhotoInput(): void {
    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  changeSection(section : string) {
    this.section = section;
  }

  viewProfile(user: any): void {
  this.userService.getUserById(user.idUser).subscribe({
    next: (res) => {
      this.selectedUser = res;
      this.loadUserProfileData(user.idUser, true); // true para modo "ajeno"
      this.section = 'user-followers';
    },
    error: () => {
      console.error("Error cargando perfil ajeno.");
    }
  });
}

private loadUserProfileData(userId: number, isSelectedUser = false): void {
  const isOwnProfile = !isSelectedUser;

  this.http.get<any[]>(`http://localhost:8000/users/${userId}/followers`).subscribe({
    next: (data) => {
      this.followers = (data && data.length > 0) ? data : [];
    },
    error: () => {
      this.followers = [];
    }
  });

  this.http.get<any[]>(`http://localhost:8000/users/${userId}/followings`).subscribe({
    next: (data) => {
      this.followings = (data && data.length > 0) ? data : [];
    },
    error: () => {
      this.followings = [];
    }
  });

  this.http.get<any[]>(`http://localhost:8000/users/${userId}/favorite-albums`).subscribe({
    next: (data) => {
      this.favAlbums = (data && data.length > 0) ? data : [];
    },
    error: () => {
      this.favAlbums = [];
    }
  });

  this.http.get<any[]>(`http://localhost:8000/users/${userId}/favorite-songs`).subscribe({
    next: (data) => {
      this.favSongs = (data && data.length > 0) ? data : [];
    },
    error: () => {
      this.favSongs = [];
    }
  });

  if (isOwnProfile) {
    this.http.get<any[]>(`http://localhost:8000/users/${userId}/orders`).subscribe({
      next: (data) => {
        this.orders = (data && data.length > 0) ? data : [];
      },
      error: () => {
        this.orders = [];
      }
    });
  }

  if (isSelectedUser && this.currentUser) {
    this.http.get<boolean>(`http://localhost:8000/users/${this.currentUser.idUser}/is-following/${userId}`).subscribe({
      next: (isFollow) => this.isFollowing = isFollow,
      error: () => this.isFollowing = false
    });
  }
}



  updateFollowers(): void {
    const action = this.isFollowing ? 'unfollow' : 'follow';

    this.http.post<boolean>(
        `http://localhost:8000/users/${this.selectedUser.idUser}/${action}?current_user_id=${this.currentUser.idUser}`, {}
    ).subscribe({
        next: (response: boolean) => {
            console.log(`Acción ${action} realizada con éxito:`, response);

            if (response) {
                // Actualiza el estado de isFollowing
                this.isFollowing = !this.isFollowing;

                // Actualiza el número de seguidores localmente
                if (this.isFollowing) {
                    this.selectedUser.followerNumber++;
                } else {
                    this.selectedUser.followerNumber--;
                }

                // Recarga los seguidores desde el backend para garantizar sincronización
                this.loadFollowers(this.selectedUser.idUser);

                // Guarda los cambios en localStorage
                this.storage.setLocal('selectedUser', JSON.stringify(this.selectedUser));
            } else {
                console.error(`La acción ${action} no se pudo completar.`);
            }
        },
        error: (err) => {
            console.error(`Error al realizar la acción ${action}:`, err);
        }
    });
  }

  goToCurrentUserProfile(): void {
    this.selectedUser = null;
    this.loadFollowers(this.currentUser.idUser);
    this.loadFollowings(this.currentUser.idUser);
    this.section = 'profile';
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
}