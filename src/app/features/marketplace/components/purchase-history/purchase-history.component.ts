import {Component, inject, OnInit, signal} from '@angular/core';
import {Order} from '../../../orders/model/order.model';
import {OrderService} from '../../../orders/services/order.service';
import {MessageService} from 'primeng/api';
import {Paginator} from 'primeng/paginator';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {Card} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {Calendar} from 'primeng/calendar';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-purchase-history',
  imports: [
    Paginator,
    Button,
    RouterLink,
    Card,
    DropdownModule,
    FormsModule,
    Calendar,
    ToastModule
  ],
  standalone: true,
  providers: [OrderService, MessageService],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.scss'
})
export class PurchaseHistoryComponent implements OnInit {

  private orderService = inject(OrderService);
  private messageService = inject(MessageService);

  deliveredOrders = signal<Order[]>([]);
  filteredOrders = signal<Order[]>([]);
  loading = signal(false);

  selectedYear: number | null = null;
  selectedMonth: number | null = null;
  dateRange: Date[] | null = null;

  first = 0;
  rows = 10;
  totalRecords = 0;

  yearOptions: any[] = [];
  monthOptions = [
    { label: 'Todos los meses', value: null },
    { label: 'Enero', value: 0 },
    { label: 'Febrero', value: 1 },
    { label: 'Marzo', value: 2 },
    { label: 'Abril', value: 3 },
    { label: 'Mayo', value: 4 },
    { label: 'Junio', value: 5 },
    { label: 'Julio', value: 6 },
    { label: 'Agosto', value: 7 },
    { label: 'Septiembre', value: 8 },
    { label: 'Octubre', value: 9 },
    { label: 'Noviembre', value: 10 },
    { label: 'Diciembre', value: 11 }
  ];

  ngOnInit() {
    this.initializeYearOptions();
    this.loadPurchaseHistory();
  }

  initializeYearOptions() {
    const currentYear = new Date().getFullYear();
    this.yearOptions = [
      { label: 'Todos los años', value: null }
    ];

    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      this.yearOptions.push({ label: year.toString(), value: year });
    }
  }

  loadPurchaseHistory() {
    this.loading.set(true);

    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        const deliveredOrders = orders.filter(order => order.status === 'DELIVERED');

        deliveredOrders.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        this.deliveredOrders.set(deliveredOrders);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el historial de compras'
        });
      }
    });
  }

  applyFilters() {
    let filtered = [...this.deliveredOrders()];

    if (this.selectedYear !== null) {
      filtered = filtered.filter(order =>
        new Date(order.createdAt).getFullYear() === this.selectedYear
      );
    }

    if (this.selectedMonth !== null) {
      filtered = filtered.filter(order =>
        new Date(order.createdAt).getMonth() === this.selectedMonth
      );
    }

    if (this.dateRange && this.dateRange.length === 2) {
      const startDate = this.dateRange[0];
      const endDate = this.dateRange[1];

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    this.filteredOrders.set(filtered);
    this.totalRecords = filtered.length;
    this.first = 0;
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  getPaginatedOrders(): Order[] {
    const filtered = this.filteredOrders();
    return filtered.slice(this.first, this.first + this.rows);
  }

  clearFilters() {
    this.selectedYear = null;
    this.selectedMonth = null;
    this.dateRange = null;
    this.applyFilters();
  }

  confirmDelivery(order: Order) {
    this.orderService.confirmDelivery(order.id).subscribe({
      next: (updatedOrder) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Entrega confirmada',
          detail: `Has confirmado la recepción del pedido #${order.id}`
        });

        // Recargar historial
        this.loadPurchaseHistory();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo confirmar la entrega'
        });
      }
    });
  }

  reorderItems(order: Order) {
    this.messageService.add({
      severity: 'info',
      summary: 'Función en desarrollo',
      detail: 'Pronto podrás reordenar productos directamente'
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  getTotalSpent(): number {
    return this.deliveredOrders().reduce((sum, order) => sum + order.totalAmount, 0);
  }

  getOrderCount(): number {
    return this.deliveredOrders().length;
  }

  getAverageOrderValue(): number {
    const orders = this.deliveredOrders();
    return orders.length > 0 ? this.getTotalSpent() / orders.length : 0;
  }
}
