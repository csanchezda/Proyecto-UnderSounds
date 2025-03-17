import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BoxContainerComponent } from '../../box-container/box-container.component';

@Component({
  selector: 'app-forgot-password',
  imports: [BoxContainerComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
