import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoxContainerComponent } from '../../box-container/box-container.component';

@Component({
  selector: 'app-forgot-password',
  imports: [BoxContainerComponent, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  sendResetEmail(): void {
    if (!this.email.trim()) {
      alert('⚠️ Por favor, introduce un correo electrónico.');
      return;
    }

    if (!this.validateEmail(this.email.trim())) {
      alert('⚠️ Formato de correo inválido. Ejemplo: usuario@email.com');
      return;
    }

    alert('📩 Correo enviado. Revisa tu bandeja de entrada.');
    // Aquí podrías añadir lógica para enviar el correo real.
  }
}
