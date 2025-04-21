import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BoxContainerComponent } from '../../box-container/box-container.component';
import { StorageService } from '../../services/storage.service'; // ⬅ importa el servicio
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register-fan',
  imports: [FormsModule, CommonModule, BoxContainerComponent],
  templateUrl: './register-fan.component.html',
  styleUrl: './register-fan.component.css'
})
export class RegisterFanComponent {
  name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  repeatPassword: string = '';
  selectedNationality: string = '';
  termsAccepted: boolean = false;
  isFan: boolean = true;
  isArtist: boolean = false;
  isGuest: boolean = false;

  countries: string[] = [
    'Spain', 'Argentina', 'Mexico', 'Colombia', 'Chile',
    'Peru', 'Venezuela', 'USA', 'UK',
    'France', 'Italy', 'Germany', 'Japan', 'South Korea'
  ];

  constructor(
      private router: Router,
      private storage: StorageService,
      private userService: UserService
    ) {}

  goBack(): void {
    window.history.back();
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  doPasswordsMatch(): boolean {
    return this.password.trim() === this.repeatPassword.trim() && this.password.length > 0;
  }

  validateForm(): boolean {
    let alerts: string[] = [];
    const users = JSON.parse(this.storage.getLocal('users') || '[]');
    const alreadyExists: boolean = users.some((u: any) => u.email === this.email);


    if (!this.name.trim() || !this.username.trim() || !this.email.trim() || !this.password.trim() || !this.repeatPassword.trim() || !this.selectedNationality.trim()) {
      alerts.push('⚠️ Todos los campos son obligatorios.');
    }

    if (alreadyExists) {
      alerts.push('⚠️ El correo electrónico ya está registrado.');
    }

    if (this.email.trim() && !this.validateEmail(this.email.trim())) {
      alerts.push('⚠️ Formato de correo inválido. Ejemplo: usuario@email.com');
    }

    if (this.password.trim() && !this.validatePassword(this.password.trim())) {
      alerts.push('⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
    }

    if (this.password.trim() && this.repeatPassword.trim() && !this.doPasswordsMatch()) {
      alerts.push('⚠️ Las contraseñas no coinciden.');
    }

    if (!this.termsAccepted) {
      alerts.push('⚠️ Debes aceptar los términos y condiciones.');
    }

    alerts.forEach(alertMessage => alert(alertMessage));

    return alerts.length === 0;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.validateForm()) {
      const userPayload = {
        userName: this.username,
        email: this.email,
        password: this.password,
        nationality: this.selectedNationality,
        isArtist: false
      };
  
      this.userService.registerUser(userPayload).subscribe({
        next: (response) => {
          alert('✅ Registro exitoso como FAN. Redirigiendo al menú principal...');
          console.log("Soy FAN", response);
  
          
          this.storage.setLocal('currentUser', JSON.stringify(response));
          this.storage.setLocal('isFan', JSON.stringify(true));
          this.storage.setLocal('isArtist', JSON.stringify(false));
          this.storage.setLocal('isGuest', JSON.stringify(false));
  
          this.router.navigate(['/main-menu']);
        },
        error: (error) => {
          console.error('❌ Error al registrar:', error);
          alert('❌ No se pudo registrar. Usuario ya existe o correo usado ya está registrado.');
        }
      });
    }
  }
  
}
