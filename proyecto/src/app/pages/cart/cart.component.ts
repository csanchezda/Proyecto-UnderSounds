import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service'; // si usas storage para guardar sesión
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service'; // si usas auth para obtener el perfil del usuario
import { ProductService } from '../../services/product.service'; // Asegúrate de importar el servicio de productos
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  products: any[] = [];
  total: string = '';
  address: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  securityCode: string = '';
  cardName: string = '';
  userId: number = 0;
  isProcessingPayment: boolean = false;
  paymentStatusMessage!: string;
  constructor(private cartService: CartService, private storage: StorageService, private paymentService: PaymentService, private router: Router, private http: HttpClient, private authService: AuthService, private productService: ProductService) {}


  ngOnInit(): void {
    this.authService.getUserProfile().then((user: { idUser: number }) => {
      this.userId = user.idUser;
      this.loadProducts();
    }).catch(() => {
      console.error('⚠️ No se pudo obtener el perfil del usuario.');
    });
  }


  loadProducts() {
    this.cartService.getCart(this.userId).subscribe({
      next: (cartItems) => {
        const productObservables = cartItems.map((item: any) =>
          this.productService.getProductById(item.idProduct).toPromise().then(product => ({
            idProduct: item.idProduct,
            quantity: item.quantity,
            name: product.title || 'Sin título',
            price: product.price + ' €',
            image: product.image || 'assets/images/Square.jpg'
          }))
        );

        Promise.all(productObservables).then(products => {
          this.products = products;
          this.calculateTotal();
        });
      },
      error: (err) => console.error('❌ Error cargando el carrito:', err)
    });
  }


  increase(index: number) {
    const product = this.products[index];
    product.quantity++;
    this.cartService.updateQuantity(this.userId, product.idProduct, product.quantity).subscribe();
    this.calculateTotal();
  }

  decrease(index: number) {
    const product = this.products[index];
    if (product.quantity > 1) {
      product.quantity--;
      this.cartService.updateQuantity(this.userId, product.idProduct, product.quantity).subscribe();
      this.calculateTotal();
    }
  }

  deleteProduct(index: number) {
    const product = this.products[index];
    this.cartService.removeItem(this.userId, product.idProduct).subscribe(() => {
      this.products.splice(index, 1);
      this.calculateTotal();
    });
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
    if (this.products.length === 0) {
      alert('⚠️ Tu carrito está vacío.');
      return;
    }

    const amountNumber = parseFloat(this.total.replace('€', '').trim()); // Convertir a número

    this.isProcessingPayment = true;
    this.paymentStatusMessage = "Procesando pago...";

    this.paymentService.processPayment(amountNumber).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.paymentStatusMessage = "✅ ¡Pago realizado con éxito!";
          alert('✅ ¡Pago realizado con éxito!');

          this.http.get<any[]>(`${environment.apiUrl}/orders/${this.userId}`).subscribe({
            next: (existingOrders) => {
              const existingProductIds = existingOrders.map(order => order.idProduct);

              for (const product of this.products) {
                if (!existingProductIds.includes(product.idProduct)) {
                  const orderPayload = {
                    idUser: this.userId,
                    idProduct: product.idProduct
                  };

                  this.http.post(`${environment.apiUrl}/orders`, orderPayload).subscribe({
                    next: () => console.log('✅ Orden creada para producto', product.idProduct),
                    error: (err) => console.error('❌ Error creando orden:', err)
                  });
                } else {
                  console.log(`⚠️ Producto ${product.idProduct} ya comprado, no se vuelve a insertar`);
                }
              }

              this.cartService.clearCart(this.userId).subscribe(() => {
                this.products = [];
                this.total = '0.00 €';
                this.router.navigate(['/']);
              });
            },
            error: (err) => {
              console.error('❌ Error obteniendo órdenes existentes:', err);
            }
          });
        }
      },
      error: (error) => {
        console.error(error);
        this.paymentStatusMessage = "❌ Error al procesar el pago.";
      }
    });
  }




  isCartEmpty(): boolean {
    return !this.products || this.products.length === 0;
  }


}
