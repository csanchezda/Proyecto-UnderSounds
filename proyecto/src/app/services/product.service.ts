import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  // Obtener un producto por su ID
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getProductByAlbumId(albumId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/album/${albumId}`);
  }

  // Obtener productos por tipo (canción o álbum)
  getSongsByAlbumId(albumId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/albums/${albumId}/songs`);
  }

  // Crear un nuevo producto
  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, product);
  }

  // Actualizar un producto
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
