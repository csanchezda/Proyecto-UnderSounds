import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BoxContainerComponent } from '../../box-container/box-container.component';

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
  termsAccepted: boolean = false;

  constructor(private router: Router) {}

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

    if (!this.name.trim() || !this.username.trim() || !this.email.trim() || !this.password.trim() || !this.repeatPassword.trim()) {
      alerts.push('⚠️ Todos los campos son obligatorios.');
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
      // Guardar usuario en localStorage
      const user = {
        name: this.name,
        username: this.username,
        email: this.email,
        password: this.password,
        role: 'fan'
      };

      let users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));

      // Guardar sesión y actualizar variables
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isFan', 'true');
      localStorage.setItem('isArtist', 'false');
      localStorage.setItem('isGuest', 'false');

      alert('✅ Registro exitoso como FAN. Redirigiendo al menú principal...');
      console.log("Soy FAN");
      this.router.navigate(['/main-menu']);
    }
  }
}
