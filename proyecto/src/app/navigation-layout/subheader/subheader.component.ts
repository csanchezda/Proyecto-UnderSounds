import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.css']
})
export class SubheaderComponent { 
  constructor(private router: Router) {}

  goToSongs(){
    this.router.navigate(['/songs']);
  }
}
