import { Component } from '@angular/core';
import { BoxContainerComponent } from '../../box-container/box-container.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-new-password',
  standalone: true,
  imports: [BoxContainerComponent, FormsModule],  
  templateUrl: './confirm-new-password.component.html'
})
export class ConfirmNewPasswordComponent {
  nuevaPassword: string = '';
  email: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (storedEmail) {
      this.email = storedEmail;
    } else {
      alert('⚠️ No se encontró un email para actualizar la contraseña.');
      this.router.navigate(['/login']);
    }
  }

  async actualizarPassword() {
    try {
      await this.userService.actualizarPassword(this.email, this.nuevaPassword);
      alert('¡Contraseña actualizada exitosamente!');
      sessionStorage.removeItem('resetPasswordPending');
      sessionStorage.removeItem('resetEmail');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('❌ Error actualizando contraseña:', error);
      alert('Error actualizando contraseña. Intenta de nuevo.');
    }
  }
}
