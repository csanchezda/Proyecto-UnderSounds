import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  idUser: number;
  idProduct: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8000/cart';

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/${userId}`);
  }

  addToCart(cartItem: CartItem): Observable<any> {
    return this.http.post(this.apiUrl, cartItem);
  }

  updateQuantity(userId: number, productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/${productId}?quantity=${quantity}`, {});
  }

  removeItem(userId: number, productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/${productId}`);
  }

  clearCart(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
}
