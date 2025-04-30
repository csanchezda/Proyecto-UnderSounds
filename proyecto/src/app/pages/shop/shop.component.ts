import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ProductService } from '../../services/product.service';

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
  isPopupOpen: boolean = false;
  selectedTypes: string[] = [];
  selectedRatings: string[] = [];
  types: string[] = ['Canción', 'Álbum'];
  ratings: string[] = ['1 o más estrellas', '2 o más estrellas', '3 o más estrellas', '4 o más estrellas'];
  minPrice: number = 1;
  maxPrice: number = 20;

  sliderOptions = {
    floor: 1,
    ceil: 20,
    translate: (value: number): string => value + ' €'
  };

  searchQuery: string = '';
  originalProducts: any[] = [];

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private renderer: Renderer2,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.originalProducts = products;
        this.applyFiltersToProducts(products);
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
      }
    });
  }

  onSearchChange(): void {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.applyFiltersToProducts(this.originalProducts);
      return;
    }

    const filtered = this.originalProducts.filter(p =>
      p.title.toLowerCase().includes(query)
    );

    this.songs = filtered.filter(p => p.isSong);
    this.albums = filtered.filter(p => !p.isSong);
  }

  applyFilters(): void {
    this.loadProducts(); // Recarga y aplica filtros en base al estado actual
    this.toggleFilterPopup();
  }

  applyFiltersToProducts(products: any[]): void {
    let filtered = [...products];

    // Filtro por tipo
    if (this.selectedTypes.includes('Canción') && !this.selectedTypes.includes('Álbum')) {
      filtered = filtered.filter(p => p.isSong);
    } else if (!this.selectedTypes.includes('Canción') && this.selectedTypes.includes('Álbum')) {
      filtered = filtered.filter(p => !p.isSong);
    }

    // Filtro por precio
    filtered = filtered.filter(p => p.price >= this.minPrice && p.price <= this.maxPrice);

    // Filtro por valoración
    if (this.selectedRatings.length > 0) {
      const minRatings = this.selectedRatings.map(label => parseInt(label[0], 10));
      const minRequired = Math.min(...minRatings);
      filtered = filtered.filter(p => Math.round(p.averageRating) >= minRequired);
    }

    // Orden
    switch (this.selectedOrder) {
      case 'PrecioAsc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'PrecioDesc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Valoración':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'Novedades':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    this.songs = filtered.filter(p => p.isSong);
    this.albums = filtered.filter(p => !p.isSong);
  }

  selectOrder(order: string): void {
    if (this.selectedOrder === order) {
      this.selectedOrder = '';
      this.loadProducts();
    } else {
      this.selectedOrder = order;
      this.loadProducts();
    }
  }

  toggleRatingSelection(rating: string): void {
    if (this.selectedRatings.includes(rating)) {
      this.selectedRatings = this.selectedRatings.filter(r => r !== rating);
    } else {
      this.selectedRatings.push(rating);
    }
  }

  toggleTypeSelection(type: string): void {
    if (this.selectedTypes.includes(type)) {
      this.selectedTypes = this.selectedTypes.filter(t => t !== type);
    } else {
      this.selectedTypes.push(type);
    }
  }

  removeType(type: string, event: Event): void {
    event.stopPropagation();
    this.selectedTypes = this.selectedTypes.filter(t => t !== type);
  }

  toggleFilterPopup(): void {
    this.isPopupOpen = !this.isPopupOpen;
    if (this.isPopupOpen) {
      const button = this.elementRef.nativeElement.querySelector('.btn:first-child');
      const popup = this.elementRef.nativeElement.querySelector('.filter-popup');

      const rect = button.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const left = rect.left + window.scrollX;

      this.renderer.setStyle(popup, 'top', `${top}px`);
      this.renderer.setStyle(popup, 'left', `${left}px`);
    }
  }

  setActive(event: Event): void {
    const clickedButton = event.target as HTMLElement;
    clickedButton.classList.toggle('active');
  }

  goToArticle(idProduct: number, isSong: boolean): void {
    if (isSong) {
      this.router.navigate(['/songs', idProduct]);
    } else {
      this.router.navigate(['/albums', idProduct]);
    }
  }
}
