import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {OrderService} from '../../services/order.service';
import {Order} from '../../model/order.model';
import {MessageService} from 'primeng/api';
import {Divider} from 'primeng/divider';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {Tag} from 'primeng/tag';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, Divider, Card, Button, Tag],
  providers: [MessageService, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private messageService = inject(MessageService);

  order = signal<Order | null>(null);
  loading = signal(false);
  orderId: number = 0;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      if (this.orderId) {
        this.loadOrderDetail();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'ID de pedido no válido'
        });
        this.router.navigate(['/pedidos/order']);
      }
    });
  }

  loadOrderDetail() {
    this.loading.set(true);
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el detalle del pedido'
        });
        this.router.navigate(['/client/orders']);
      }
    });
  }

  cancelOrder() {
    const currentOrder = this.order();
    if (currentOrder && this.canCancelOrder(currentOrder)) {
      this.orderService.cancelOrder(currentOrder.id).subscribe({
        next: (updatedOrder) => {
          this.order.set(updatedOrder);
          this.messageService.add({
            severity: 'success',
            summary: 'Pedido cancelado',
            detail: `El pedido #${currentOrder.id} ha sido cancelado`
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cancelar el pedido'
          });
        }
      });
    }
  }

  canCancelOrder(order: Order): boolean {
    return order.status === 'PENDING' || order.status === 'CONFIRMED';
  }

  getOrderStatusText(status: string): string {
    return this.orderService.getOrderStatusText(status);
  }

  getOrderStatusSeverity(status: string) {
    return this.orderService.getOrderStatusSeverity(status);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack() {
    this.router.navigate(['/pedidos/order']);
  }

  downloadInvoice(){
    console.log("Descargando factura para el pedido:", this.orderId);

  }
}
