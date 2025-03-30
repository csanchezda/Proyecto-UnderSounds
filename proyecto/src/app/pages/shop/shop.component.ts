import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSliderModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  selectedOrder: string = '';
  songs: any[] = [];
  albums: any[] = [];
  isFilterActive: boolean = false;
  selectedTypes: string[] = [];
  selectedRatings: string[] = [];
  types: string[] = ['Canción', 'Album'];
  ratings: string[] = ['1 o mas estrellas', '2 o mas estrellas', '3 o mas estrellas', '4 o mas estrellas'];
  minPrice: number = 1;
  maxPrice: number = 100;
  duration: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  sliderOptions = {
    floor: 1,
    ceil: 100,
    translate: (value: number): string => {
      return value.toString();
    }
  }
  

  constructor(private elementRef: ElementRef, private router: Router, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.loadSongs();
    this.loadAlbums();
  }

  selectOrder(order: string): void {
    this.selectedOrder = order; // Actualiza el orden seleccionado
    console.log('Orden seleccionado:', order);
    // Aquí puedes agregar lógica adicional para ordenar los artículos
  }

  addHoverEffect() {
    const cards = this.elementRef.nativeElement.querySelectorAll('.album-card h4');
    cards.forEach((card: HTMLElement) => {
      card.addEventListener('mouseover', () => {
        card.classList.add('scrolling-text');
      });

      card.addEventListener('mouseout', () => {
        card.classList.remove('scrolling-text');
      });
    });
  }

 setActive(event: Event) {
    const clickedButton = event.target as HTMLElement;
    clickedButton.classList.toggle('active');
  }
  
  toggleRatingSelection(rating: string): void {
    if (this.selectedRatings.includes(rating)) {
      this.selectedRatings = this.selectedRatings.filter(l => l !== rating);
    } else {
      this.selectedRatings.push(rating);
    }
  }

  toggleFilterPopup(): void {
    this.isFilterActive = !this.isFilterActive;
  }

  toggleTypeSelection(type: string) {
    if (this.selectedTypes.includes(type)) {
      this.selectedTypes = this.selectedTypes.filter(g => g !== type);
    }
    else {
      this.selectedTypes.push(type);
    }
  }

  removeType(type: string, event: Event): void {
    event.stopPropagation(); // Evita que el clic en el botón cierre el popup
    this.selectedTypes = this.selectedTypes.filter(g => g !== type);
  }


  applyFilters() {
    console.log('Tipos de artículos seleccionados:' , this.selectedTypes);
    console.log('Rango de precios:' , this.minPrice, 'a', this.maxPrice);
    this.toggleFilterPopup();
  }

  goToArticle(articleid: number, type: string) {
    if (type === 'Cancion') {
      this.router.navigate([`/shop/songs/${articleid}`]);
    }
    else if (type === 'Album') {
      this.router.navigate([`/shop/albums/${articleid}`]);
    }
  }

  

  // Función para cargar los articulos desde un archivo JSON
  loadSongs() {
    fetch('assets/data/SongsList.json')
      .then(response => response.json())
      .then(data => {
        this.songs = data; // Asigna los datos obtenidos al array de articulos
      })
      .catch(error => console.error('Error cargando los articulos:', error));
  }

  loadAlbums() {
    fetch('assets/data/AlbumsList.json')
      .then(response => response.json())
      .then(data => {
        this.albums = data; // Asigna los datos obtenidos al array de articulos
      })
      .catch(error => console.error('Error cargando los articulos:', error));
  }
}
