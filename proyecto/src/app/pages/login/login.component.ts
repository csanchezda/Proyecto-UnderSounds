import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BoxContainerComponent } from '../../box-container/box-container.component';

@Component({
  selector: 'app-login',
  imports: [BoxContainerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
