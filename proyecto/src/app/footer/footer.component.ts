import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private router: Router) {}

  goToInicio() {
    this.router.navigate(['/']);
  }

  goToAbout() {
    this.router.navigate(['/about']);
  }

  goToFAQ() {
    this.router.navigate(['/faq']);
  }

  goToPrivacy() {
    this.router.navigate(['/privacy']);
  }

  goToTerms() {
    this.router.navigate(['/terms']);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
