import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/payments`;

  processPayment(paymentInfo: any, orderId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/process`, {
      paymentInfo,
      orderId
    });
  }

  getPaymentMethods(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/methods`);
  }

  validatePaymentInfo(paymentInfo: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/validate`, paymentInfo);
  }
}
