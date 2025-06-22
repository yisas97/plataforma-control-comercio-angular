import {Component, inject, OnInit, signal} from '@angular/core';
import {MessageService} from 'primeng/api';
import {CommonModule} from '@angular/common';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Skeleton} from 'primeng/skeleton';
import {ToastModule} from 'primeng/toast';
import {TabPanel, TabView} from 'primeng/tabview';
import {Tag} from 'primeng/tag';
import {Product} from '../../../products/model/product.model';
import {ProductService} from '../../../products/services/product.service';
import {CartService} from '../../services/cart.service';
import {Router} from '@angular/router';

interface UserStats {
  totalInteractions: number;
  totalViews: number;
  totalPurchases: number;
  totalCartAdds: number;
  purchaseFrequency: number;
  averageSpending: number;
  favoriteCategory: string;
  preferredCategories: string[];
  lastActivity: string;
}

@Component({
  selector: 'app-recommendations',
  imports: [
    CommonModule,
    Button,
    Card,
    Tag,
    Skeleton,
    ToastModule,
    TabView,
    TabPanel
  ],
  providers: [MessageService],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss'
})
export class RecommendationsComponent implements OnInit {
  personalizedRecommendations = signal<Product[]>([]);
  popularRecommendations = signal<Product[]>([]);
  localRecommendations = signal<Product[]>([]);
  userStats = signal<UserStats | null>(null);

  // Loading states
  loadingPersonalized = signal(false);
  loadingPopular = signal(false);
  loadingLocal = signal(false);
  loadingStats = signal(false);

  // Services
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  ngOnInit() {
    this.loadUserStats();
    this.loadAllRecommendations();
  }

  private loadAllRecommendations() {
    this.loadPersonalizedRecommendations();
    this.loadPopularRecommendations();
    this.loadLocalRecommendations();
  }

  private loadUserStats() {
    this.loadingStats.set(true);

    this.productService.getUserStats().subscribe({
      next: (stats: UserStats) => {
        this.userStats.set(stats);
        this.loadingStats.set(false);
        console.log('User stats loaded:', stats);
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
        this.loadingStats.set(false);
        // Fallback a datos básicos
        this.userStats.set({
          totalInteractions: 0,
          totalViews: 0,
          totalPurchases: 0,
          totalCartAdds: 0,
          purchaseFrequency: 0,
          averageSpending: 0,
          favoriteCategory: 'Sin datos',
          preferredCategories: [],
          lastActivity: new Date().toISOString()
        });
      }
    });
  }

  private loadPersonalizedRecommendations() {
    this.loadingPersonalized.set(true);

    // Usar el endpoint /api/products/recommendations que ya existe
    this.productService.getRecommendations(12).subscribe({
      next: (products) => {
        this.personalizedRecommendations.set(products);
        this.loadingPersonalized.set(false);
        console.log('Personalized recommendations loaded:', products.length);
      },
      error: (error) => {
        console.error('Error loading personalized recommendations:', error);
        this.loadingPersonalized.set(false);
        this.messageService.add({
          severity: 'warn',
          summary: 'Información',
          detail: 'No se pudieron cargar las recomendaciones personalizadas'
        });
      }
    });
  }

  private loadPopularRecommendations() {
    this.loadingPopular.set(true);

    // Usar el endpoint /api/products/recommendations/popular que ya existe
    this.productService.getPopularRecommendations(16).subscribe({
      next: (products) => {
        this.popularRecommendations.set(products);
        this.loadingPopular.set(false);
        console.log('Popular recommendations loaded:', products.length);
      },
      error: (error) => {
        console.error('Error loading popular recommendations:', error);
        this.loadingPopular.set(false);
        // Fallback a productos regulares
        this.productService.getProducts().subscribe({
          next: (products) => {
            this.popularRecommendations.set(products.slice(0, 16));
          },
          error: (fallbackError) => {
            console.error('Error loading fallback products:', fallbackError);
          }
        });
      }
    });
  }

  private loadLocalRecommendations() {
    this.loadingLocal.set(true);

    // Como no tienes endpoint específico para local, usar productos regulares con filtrado
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Simular productos locales tomando algunos aleatorios
        const localProducts = products
          .sort(() => 0.5 - Math.random())
          .slice(0, 6)
          .map(p => ({
            ...p,
            producerLocation: p.producerLocation || 'Lima, Perú'
          }));

        this.localRecommendations.set(localProducts);
        this.loadingLocal.set(false);
        console.log('Local recommendations loaded:', localProducts.length);
      },
      error: (error) => {
        console.error('Error loading local recommendations:', error);
        this.loadingLocal.set(false);
      }
    });
  }

  getProductImage(product: Product): string {
    return `assets/images/tablet.jpg`;
  }

  getStockStatus(product: Product): string {
    if (product.quantity === 0) return 'AGOTADO';
    if (product.quantity < 10) return 'BAJO STOCK';
    return 'EN STOCK';
  }

  getStockSeverity(product: Product) {
    switch (this.getStockStatus(product)) {
      case 'EN STOCK': return 'success';
      case 'BAJO STOCK': return 'warning';
      case 'AGOTADO': return 'danger';
      default: return 'info';
    }
  }

  getRecommendationScore(product: Product): number {
    // Si el producto tiene score de IA, usarlo; sino calcular uno
    if (product.aiRecommendationScore) {
      return Math.round(product.aiRecommendationScore);
    }

    // Calcular un score basado en datos reales
    const baseScore = 75;
    const priceScore = product.price > 500 ? 5 : 10;
    const stockScore = product.quantity > 10 ? 10 : 5;
    return Math.min(95, baseScore + priceScore + stockScore);
  }

  isInStock(product: Product): boolean {
    return (product.quantity || 0) > 0;
  }

  addToCart(product: Product) {
    if (!product.id) return;

    this.cartService.addToCart({
      productId: product.id,
      quantity: 1
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Agregado al carrito',
          detail: `${product.name} ha sido agregado a tu carrito`
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el producto al carrito'
        });
      }
    });
  }

  toggleFavorite(product: Product) {
    if (!product.id) return;

    this.productService.toggleFavorite(product.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Favorito actualizado',
          detail: `${product.name} actualizado en favoritos`
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar favoritos'
        });
      }
    });
  }

  viewProduct(productId: number) {
    this.router.navigate(['/marketplace/product', productId]);
  }

  goToMarketplace() {
    this.router.navigate(['/marketplace']);
  }

  refreshRecommendations() {
    this.loadUserStats();
    this.loadAllRecommendations();
    this.messageService.add({
      severity: 'info',
      summary: 'Actualizando',
      detail: 'Recomendaciones actualizadas con la última actividad'
    });
  }

  // Métodos para formatear los datos de estadísticas
  formatLastActivity(): string {
    const stats = this.userStats();
    if (!stats?.lastActivity) return 'Sin actividad';

    const date = new Date(stats.lastActivity);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPurchaseFrequencyText(): string {
    const stats = this.userStats();
    if (!stats) return 'Sin datos';

    if (stats.purchaseFrequency === 0) return 'Primera vez';
    if (stats.purchaseFrequency < 5) return 'Comprador ocasional';
    if (stats.purchaseFrequency < 15) return 'Comprador regular';
    return 'Comprador frecuente';
  }

  getTopCategories(): string {
    const stats = this.userStats();
    if (!stats?.preferredCategories?.length) return 'Sin categorías';

    return stats.preferredCategories.slice(0, 2).join(', ');
  }
}
