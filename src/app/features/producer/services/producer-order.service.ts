import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { Observable } from 'rxjs';
import {Order} from '../../orders/model/order.model';
import {ProducerSalesStats} from '../model/producer-order.model';

@Injectable({
  providedIn: 'root'
})
export class ProducerOrderService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/producer/orders`;

  getProducerOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`);
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/status/${status}`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  confirmOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/confirm`, {});
  }

  prepareOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/prepare`, {});
  }

  shipOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/ship`, {});
  }

  getSalesStats(): Observable<ProducerSalesStats> {
    return this.http.get<ProducerSalesStats>(`${this.apiUrl}/stats`);
  }

  getTodayOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/daily-summary`);
  }

  getOrderStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmado',
      'PREPARING': 'Preparando',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  getOrderStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const severityMap: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' } = {
      'PENDING': 'warn',
      'CONFIRMED': 'info',
      'PREPARING': 'info',
      'SHIPPED': 'secondary',
      'DELIVERED': 'success',
      'CANCELLED': 'danger'
    };
    return severityMap[status] || 'secondary';
  }

  getAvailableActions(status: string): string[] {
    switch (status) {
      case 'PENDING':
        return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED':
        return ['PREPARING', 'CANCELLED'];
      case 'PREPARING':
        return ['SHIPPED'];
      case 'SHIPPED':
        return ['DELIVERED'];
      default:
        return [];
    }
  }
}
