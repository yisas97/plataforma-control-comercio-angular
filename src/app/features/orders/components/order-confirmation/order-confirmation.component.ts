import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {OrderService} from '../../services/order.service';
import {Order} from '../../model/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  order = signal<Order | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.router.navigate(['/pedidos']);
      return;
    }

    this.isLoading.set(true);
    this.orderService.getOrderById(+orderId).subscribe({
      next: (data) => {
        this.order.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando pedido', err);
        this.isLoading.set(false);
        this.router.navigate(['/pedidos']);
      }
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'PAID': return 'Pagado';
      case 'SHIPPED': return 'Enviado';
      case 'DELIVERED': return 'Entregado';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
