import {Component, inject, OnInit, signal} from '@angular/core';
import {ProducerSalesStats} from '../../model/producer-order.model';
import {ProducerOrderService} from '../../services/producer-order.service';
import {Order} from '../../../orders/model/order.model';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {ChartModule } from 'primeng/chart';
import {PrimeTemplate} from 'primeng/api';
import {BlockchainService} from '../../../products/services/blockchain.service';
import {ProductService} from '../../../products/services/product.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-producer-dashboard',
  imports: [
    Button,
    RouterLink,
    Card,
    Tag,
    ChartModule,
    PrimeTemplate,
    NgClass
  ],
  templateUrl: './producer-dashboard.component.html',
  standalone: true,
  styleUrl: './producer-dashboard.component.scss'
})
export class ProducerDashboardComponent implements OnInit {

  private producerOrderService = inject(ProducerOrderService);
  private blockchainService = inject(BlockchainService);
  private productService = inject(ProductService);

  salesStats = signal<ProducerSalesStats | null>(null);
  recentOrders = signal<Order[]>([]);
  loading = signal(false);
  recentProducts = signal<any[]>([]);

  orderStatusChartData: any;
  revenueChartData: any;
  chartOptions: any;

  ngOnInit() {
    this.setupChartOptions();
    this.loadDashboardData();
    this.loadRecentProducts();
  }

  loadDashboardData() {
    this.loading.set(true);

    Promise.all([
      this.producerOrderService.getSalesStats().toPromise(),
      this.producerOrderService.getProducerOrders().toPromise()
    ]).then(([stats, orders]) => {
      this.salesStats.set(stats || null);
      this.recentOrders.set((orders || []).slice(0, 20));

      if (stats) {
        this.setupCharts(stats);
      }

      this.loading.set(false);
    }).catch(() => {
      this.loading.set(false);
    });
  }

  loadRecentProducts() {
    this.productService.getProducerProducts().subscribe({
      next: (products) => {
        const recent = products.slice(0, 5).map(product => ({
          ...product,
          hasCertificate: true
        }));
        this.recentProducts.set(recent);
      },
      error: (error) => {
        console.error('Error loading recent products:', error);
      }
    });
  }

  checkCertificate(productId: number) {
    this.blockchainService.getCertificate(productId).subscribe({
      next: (certificate) => {
        console.log('Certificate found:', certificate);
        // Mostrar toast de éxito
      },
      error: (error) => {
        console.log('No certificate found for product:', productId);
      }
    });
  }

  setupChartOptions() {
    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  setupCharts(stats: ProducerSalesStats) {
    this.orderStatusChartData = {
      labels: ['Pendientes', 'Confirmados', 'Preparando', 'Enviados', 'Entregados'],
      datasets: [
        {
          data: [
            stats.pendingOrders,
            stats.confirmedOrders,
            stats.preparingOrders,
            stats.shippedOrders,
            stats.deliveredOrders
          ],
          backgroundColor: [
            '#FEF3C7', // Amarillo para pendientes
            '#DBEAFE', // Azul para confirmados
            '#E0E7FF', // Púrpura para preparando
            '#F3F4F6', // Gris para enviados
            '#D1FAE5'  // Verde para entregados
          ],
          borderColor: [
            '#F59E0B',
            '#3B82F6',
            '#8B5CF6',
            '#6B7280',
            '#10B981'
          ],
          borderWidth: 2
        }
      ]
    };

    this.revenueChartData = {
      labels: ['Hoy', 'Esta Semana', 'Este Mes', 'Total'],
      datasets: [
        {
          label: 'Ingresos ($)',
          data: [
            stats.todayRevenue,
            stats.thisWeekRevenue,
            stats.thisMonthRevenue,
            stats.totalRevenue
          ],
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          fill: true
        }
      ]
    };
  }

  formatCurrency(amount: number): string {
    return `${amount.toFixed(2)}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-PE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getOrderStatusText(status: string): string {
    return this.producerOrderService.getOrderStatusText(status);
  }

  getOrderStatusSeverity(status: string) {
    return this.producerOrderService.getOrderStatusSeverity(status);
  }

  refreshDashboard() {
    this.loadDashboardData();
  }
}
