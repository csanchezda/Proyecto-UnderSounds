import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BoxContainerComponent } from '../../box-container/box-container.component';

@Component({
  selector: 'app-register',
  imports: [BoxContainerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }

  goToFanRegister() {
    this.router.navigate(['/register-fan']);
  }

  goToArtistRegister() {
    this.router.navigate(['/register-artist']);
  }
}
