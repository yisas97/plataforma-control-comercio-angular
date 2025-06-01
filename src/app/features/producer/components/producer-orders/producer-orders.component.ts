import {Component, inject, OnInit, signal} from '@angular/core';
import { ProducerOrderService } from '../../services/producer-order.service';
import {MessageService} from 'primeng/api';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Order} from '../../../orders/model/order.model';
import {ProducerSalesStats} from '../../model/producer-order.model';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {TabPanel, TabView} from 'primeng/tabview';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Tooltip} from 'primeng/tooltip';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-producer-orders',
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    Button,
    Card,
    TabView,
    TabPanel,
    DropdownModule,
    TableModule,
    Tag,
    Tooltip,
    ToastModule
  ],
  providers: [MessageService, ProducerOrderService],
  templateUrl: './producer-orders.component.html',
  standalone: true,
  styleUrl: './producer-orders.component.scss'
})
export class ProducerOrdersComponent implements OnInit {

  private producerOrderService = inject(ProducerOrderService);
  private messageService = inject(MessageService);

  allOrders = signal<Order[]>([]);
  filteredOrders = signal<Order[]>([]);
  salesStats = signal<ProducerSalesStats | null>(null);
  todayOrders = signal<Order[]>([]);

  loading = signal(false);
  selectedStatus = '';
  selectedOrder: Order | null = null;
  showOrderDialog = false;

  statusOptions = [
    { label: 'Todos los estados', value: '' },
    { label: 'Pendientes', value: 'PENDING' },
    { label: 'Confirmados', value: 'CONFIRMED' },
    { label: 'Preparando', value: 'PREPARING' },
    { label: 'Enviados', value: 'SHIPPED' },
    { label: 'Entregados', value: 'DELIVERED' },
    { label: 'Cancelados', value: 'CANCELLED' }
  ];

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.loading.set(true);

    Promise.all([
      this.producerOrderService.getProducerOrders().toPromise(),
      this.producerOrderService.getSalesStats().toPromise(),
      this.producerOrderService.getTodayOrders().toPromise()
    ]).then(([orders, stats, todayOrders]) => {
      this.allOrders.set(orders || []);
      this.filteredOrders.set(orders || []);
      this.salesStats.set(stats || null);
      this.todayOrders.set(todayOrders || []);
      this.loading.set(false);
    }).catch(error => {
      this.loading.set(false);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar datos de pedidos'
      });
    });
  }

  onStatusFilterChange() {
    if (this.selectedStatus) {
      const filtered = this.allOrders().filter(order => order.status === this.selectedStatus);
      this.filteredOrders.set(filtered);
    } else {
      this.filteredOrders.set(this.allOrders());
    }
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
    this.showOrderDialog = true;
  }

  confirmOrder(order: Order) {
    this.producerOrderService.confirmOrder(order.id).subscribe({
      next: (updatedOrder) => {
        this.updateOrderInList(updatedOrder);
        this.messageService.add({
          severity: 'success',
          summary: 'Pedido confirmado',
          detail: `El pedido #${order.id} ha sido confirmado`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo confirmar el pedido'
        });
      }
    });
  }

  prepareOrder(order: Order) {
    this.producerOrderService.prepareOrder(order.id).subscribe({
      next: (updatedOrder) => {
        this.updateOrderInList(updatedOrder);
        this.messageService.add({
          severity: 'success',
          summary: 'Pedido en preparación',
          detail: `El pedido #${order.id} está siendo preparado`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el pedido'
        });
      }
    });
  }

  shipOrder(order: Order) {
    this.producerOrderService.shipOrder(order.id).subscribe({
      next: (updatedOrder) => {
        this.updateOrderInList(updatedOrder);
        this.messageService.add({
          severity: 'success',
          summary: 'Pedido enviado',
          detail: `El pedido #${order.id} ha sido enviado`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo marcar como enviado'
        });
      }
    });
  }

  private updateOrderInList(updatedOrder: Order) {
    const currentOrders = this.allOrders();
    const index = currentOrders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
      currentOrders[index] = updatedOrder;
      this.allOrders.set([...currentOrders]);
      this.onStatusFilterChange();
    }
  }

  getOrderStatusText(status: string): string {
    return this.producerOrderService.getOrderStatusText(status);
  }

  getOrderStatusSeverity(status: string) {
    return this.producerOrderService.getOrderStatusSeverity(status);
  }

  getAvailableActions(status: string): string[] {
    return this.producerOrderService.getAvailableActions(status);
  }

  canPerformAction(order: Order, action: string): boolean {
    return this.getAvailableActions(order.status).includes(action);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return `${amount.toFixed(2)}`;
  }

  refreshData() {
    this.loadInitialData();
  }
}
