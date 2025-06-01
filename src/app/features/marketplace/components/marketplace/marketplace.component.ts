import {Component, inject, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Tag} from 'primeng/tag';
import {DataView} from 'primeng/dataview';
import {NgClass} from '@angular/common';
import {ProductService} from '../../../products/services/product.service';
import {Product} from '../../../products/model/product.model';
import {MessageService} from 'primeng/api';
import {CartService} from '../../services/cart.service';
import {Producer} from '../../../producer/model/producer.model';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Card} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-marketplace',
  imports: [
    Button,
    Tag,
    DataView,
    NgClass,
    FormsModule,
    InputText,
    Card,
    DropdownModule
  ],
  templateUrl: './marketplace.component.html',
  providers: [ProductService, MessageService],
  standalone: true,
  styleUrl: './marketplace.component.scss'
})
export class MarketplaceComponent implements OnInit {
  products = signal<Product[]>([]);
  producers = signal<Producer[]>([]);

  selectedProducer: Producer | null = null;
  searchProducerText: string = '';
  loading = signal(false);

  marketplaceService = inject(ProductService);
  cartService = inject(CartService);
  messageService = inject(MessageService);

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.loading.set(true);

    Promise.all([
      this.marketplaceService.getProducts().toPromise(),
      this.marketplaceService.getProducers().toPromise()
    ]).then(([products, producers]) => {
      this.products.set(products || []);
      this.producers.set(producers || []);
      this.loading.set(false);
    }).catch(error => {
      this.loading.set(false);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar datos del marketplace'
      });
    });
  }

  onProducerChange() {
    if (this.selectedProducer) {
      this.loading.set(true);
      this.marketplaceService.getProductsByProducer(this.selectedProducer.id).subscribe({
        next: (products) => {
          this.products.set(products);
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al filtrar productos por productor'
          });
        }
      });
    } else {
      this.loadAllProducts();
    }
  }

  searchByProducerName() {
    if (this.searchProducerText.trim()) {
      this.loading.set(true);
      this.marketplaceService.searchProductsByProducer(this.searchProducerText).subscribe({
        next: (products) => {
          this.products.set(products);
          this.loading.set(false);
        },
        error: (error) => {
          this.loading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al buscar productos por productor'
          });
        }
      });
    } else {
      this.loadAllProducts();
    }
  }

  clearFilters() {
    this.selectedProducer = null;
    this.searchProducerText = '';
    this.loadAllProducts();
  }

  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case 'EN STOCK':
        return 'success';
      case 'BAJO STOCK':
        return 'warn';
      case 'AGOTADO':
        return 'danger';
      default:
        return null;
    }
  }

  addToCart(product: Product) {
    if (!product.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Producto no válido'
      });
      return;
    }

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

  filterByProducerName(producerName: string) {
    if (producerName) {
      this.searchProducerText = producerName;
      this.selectedProducer = null;
      this.searchByProducerName();
    }
  }

  private loadAllProducts() {
    this.loading.set(true);
    this.marketplaceService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar productos'
        });
      }
    });
  }
}
