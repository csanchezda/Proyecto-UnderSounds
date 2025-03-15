import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent {
  goToPrivacy(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
