import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  products: any[] = [];
  total: string = '0.00 €';
  address: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  securityCode: string = '';
  cardName: string = '';

  ngOnInit(): void {
    this.loadProducts();
    this.calculateTotal();
  }

  loadProducts() {
    fetch('assets/images/cart/cartList.json')
      .then(response => response.json())
      .then(data => {
        this.products = data;
      })
      .catch(error => console.error('Error cargando los artistas:', error));
  }

  increase(index: number) {
    this.products[index].quantity++;
    this.calculateTotal();
  }

  decrease(index: number) {
    if (this.products[index].quantity > 0) {
      this.products[index].quantity--;
      this.calculateTotal();
    }
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    let total = 0;
    for (const product of this.products) {
      const price = parseFloat(product.price.replace(',', '.').replace(' €', ''));
      total += price * product.quantity;
    }
    this.total = total.toFixed(2) + ' €';
  }

  onSubmit() {
    console.log('Formulario enviado', {
      address: this.address,
      cardNumber: this.cardNumber,
      expiryDate: this.expiryDate,
      securityCode: this.securityCode,
      cardName: this.cardName
    });
  }
}
