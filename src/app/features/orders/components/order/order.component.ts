import {Component, inject, OnInit, signal} from '@angular/core';
import {OrderService} from '../../services/order.service';
import {MessageService} from 'primeng/api';
import {Order} from '../../model/order.model';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {RouterLink} from '@angular/router';
import {Accordion, AccordionTab} from 'primeng/accordion';

@Component({
  selector: 'app-order',
  imports: [
    Button,
    Card,
    Tag,
    RouterLink,
    Accordion,
    AccordionTab
  ],
  templateUrl: './order.component.html',
  standalone: true,
  providers: [OrderService, MessageService],
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {

  private orderService = inject(OrderService);
  private messageService = inject(MessageService);

  orders = signal<Order[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar tus pedidos'
        });
      }
    });
  }

  cancelOrder(order: Order) {
    if (order.status === 'PENDING' || order.status === 'CONFIRMED') {
      this.orderService.cancelOrder(order.id).subscribe({
        next: (updatedOrder) => {
          const currentOrders = this.orders();
          const index = currentOrders.findIndex(o => o.id === order.id);
          if (index !== -1) {
            currentOrders[index] = updatedOrder;
            this.orders.set([...currentOrders]);
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Pedido cancelado',
            detail: `El pedido #${order.id} ha sido cancelado`
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
}
