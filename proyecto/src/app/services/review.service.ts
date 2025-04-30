import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  idReview: number;
  idProduct: number;
  idUser: number;
  userName: string;
  profilePicture?: string;
  review: string;
  rating: number;
  date: string;
}

export interface ReviewCreate {
  idProduct: number;
  idUser: number;
  review: string;
  rating: number;
  date?: string;  // Opcional
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8000/reviews'; // Ajusta si tu backend usa otro puerto o ruta

  constructor(private http: HttpClient) {}

  // Traer todas las reviews (opcional)
  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}`);
  }

  // Traer las reviews de un producto específico
  getReviewsByProduct(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/product/${productId}`);
  }

  // Traer una review por su id (opcional)
  getReviewById(reviewId: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${reviewId}`);
  }

  // Crear una nueva review
  createReview(review: ReviewCreate): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}`, review);
  }

  // Actualizar una review
  updateReview(reviewId: number, review: Partial<ReviewCreate>): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${reviewId}`, review);
  }

  // Eliminar una review
  deleteReview(reviewId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${reviewId}`);
  }
}
