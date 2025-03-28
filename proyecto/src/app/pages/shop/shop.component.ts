import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  articles: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadArticles();
  }

  // Función para cargar los articulos desde un archivo JSON
  loadArticles() {
    fetch('assets/data/ArticlesList.json')
      .then(response => response.json())
      .then(data => {
        this.articles = data; // Asigna los datos obtenidos al array de articulos
      })
      .catch(error => console.error('Error cargando los articulos:', error));
  }
}
