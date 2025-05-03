import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = `${environment.apiUrl}/payment`; // URL de FastAPI

  constructor(private http: HttpClient) {}

  processPayment(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/process`, { amount: amount });
  }
}
