import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {CreateOrderRequest, Order} from '../model/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  /**
   * Crear una nueva orden
   */
  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}`, orderData);
  }

  /**
   * Obtener órdenes del usuario actual
   */
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`);
  }

  /**
   * Obtener una orden específica por ID
   */
  getOrderById(orderId: number): Observable<Order> {
    console.log(orderId);
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  /**
   * Cancelar una orden
   */
  cancelOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  /**
   * Obtener estadísticas de órdenes del usuario
   */
  getOrderStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  /**
   * Traducir estado de orden a español
   */
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

  /**
   * Obtener severidad para PrimeNG Tag según el estado
   */
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
}
