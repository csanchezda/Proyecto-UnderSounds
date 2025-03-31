import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service'; // ⬅ importa el servicio
import { FormsModule } from '@angular/forms';

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
  //Estas son listas para las secciones seguidores y siguiendo
  usersList: any[] = [];
  otherFollowersList: any[] = [];
  //Listas para mostrar los ábumes y canciones favoritos
  favSongs: any[] = [];
  favAlbums: any[] = [];
  //Variable para saber que usuario has seleccionado
  selectedUser: any = null;
  //Variable para cambiar el estado de un botón
  isUploaded: boolean = false;
  //Variable para guardar el nombre de la imagen
  image: string = '';

  constructor(private router: Router, private storage: StorageService, private r: ActivatedRoute ) {
    this.r.queryParams.subscribe(params => { // Esto sirve para escuchar los cambios en la URL
      if (params['section']) {
        this.section = params['section'];
      }
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadLists();

    const storedUser = localStorage.getItem('selectedUser');
    if (storedUser) {
      this.selectedUser = JSON.parse(storedUser);
    }
  }

  registerUser(user:any): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    // Guarda el usuario actual en localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  loadCurrentUser(): void {
    this.currentUser = JSON.parse(this.storage.getLocal('currentUser') || 'null');
    if (this.currentUser) {
      this.currentUser.username = this.currentUser.username || 'Usuario'; // Valor predeterminado si no hay username
      this.currentUser.description = this.currentUser.description || 'Sin descripción'; // Valor predeterminado si no hay descripción
      this.currentUser.image = this.currentUser.image || 'assets/icons/profile.svg'; // Valor predeterminado si no hay imagen
    }
    this.users = JSON.parse(this.storage.getLocal('users') || '[]');
  }

  loadLists(){
    fetch('assets/data/Users.json')
    .then(response => response.json())
    .then(data => {
      this.usersList = data;
    })
    .catch(error => console.error('Error cargando los seguidores:', error));
    ////////////////////////////////////////////////////////////////////////////////
    fetch('assets/data/otherUserFollowers.json')
    .then(response => response.json())
    .then(data => {
      this.otherFollowersList = data;
    })
    .catch(error => console.error('Error cargando los seguidores:', error));
    ////////////////////////////////////////////////////////////////////////////////
    fetch('assets/data/AlbumsList.json')
    .then(response => response.json())
    .then(data => {
      this.favAlbums = data;
    })
    .catch(error => console.error('Error cargando los álbumes favoritos:', error));
    ////////////////////////////////////////////////////////////////////////////////
    fetch('assets/data/SongsList.json')
    .then(response => response.json())
    .then(data => {
      this.favSongs = data;
    })
    .catch(error => console.error('Error cargando las canciones favoritas:', error));
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
    this.storage.removeLocal('usersList');
    this.storage.removeLocal('otherFollowersList');
    this.storage.removeLocal('favAlbums');
    this.storage.removeLocal('favSongs'); 
    this.storage.setLocal('isGuest', JSON.stringify(true));
    alert("Sesión cerrada correctamente. Redirigiendo a la menú principal...");
    this.router.navigate(['/main-menu']);
  }

  saveChanges() {
    this.storage.setLocal('currentUser', JSON.stringify(this.currentUser));

    const userIndex = this.users.findIndex(user => user.username === this.currentUser.username);
    if (userIndex !== -1) {
      this.users[userIndex] = this.currentUser;
      this.storage.setLocal('users', JSON.stringify(this.users));
    }
  
    alert('Se han guardado los cambios correctamente ☑');
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentUser.image = e.target.result; // Actualiza la imagen del usuario actual
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  triggerPhotoInput(): void {
    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    fileInput.click();
  }

  changeSection(section : string) {
    this.section = section;
  }

  viewProfile(user : any) {
    this.selectedUser = user;
    localStorage.setItem('selectedUser', JSON.stringify(user));
    this.section = 'user-profile';
  }

  goToAlbum(albumId: number) {
    this.router.navigate(['/album', albumId]);
  }

  goToSong(songId: number) {
    this.router.navigate(['/individual-song', songId]);
  }
  uploadButton(userId : number){
    this.isUploaded = !this.isUploaded;
  }

  isSelected(option: string): boolean {
    return this.selectedOption === option;
  }

  goToAlbum(albumId: string): void {
    this.router.navigate(['album', albumId]); 
  }
  
  goToSong(songId: string): void {
    this.router.navigate(['/individual-song', songId]); 
  }

}
