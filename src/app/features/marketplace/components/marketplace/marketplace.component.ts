import {Component, inject, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {DataView} from 'primeng/dataview';
import {NgClass} from '@angular/common';
import {ProductService} from '../../../products/services/product.service';
import {Product} from '../../../products/model/product.model';
import {MessageService} from 'primeng/api';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-marketplace',
  imports: [
    Button,
    Tag,
    DataView,
    NgClass
  ],
  templateUrl: './marketplace.component.html',
  providers: [ProductService,MessageService],
  standalone: true,
  styleUrl: './marketplace.component.scss'
})
export class MarketplaceComponent implements OnInit {
  products = signal<Product[]>([]);


  marketplaceService = inject(ProductService);
  toastService = inject(MessageService);
  cartService = inject(CartService);

  ngOnInit() {
    this.marketplaceService.getProducts()
      .subscribe((data: Product[]) => {
        const d = data.slice(0, 5);
        this.products.set([...d]);
      });
  }

  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return null;
    }
  }

  addToCart(product: Product) {
    if (!product.id) {
      this.toastService.add({
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
        this.toastService.add({
          severity: 'success',
          summary: 'Agregado al carrito',
          detail: `${product.name} ha sido agregado a tu carrito`
        });
      },
      error: (error) => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el producto al carrito'
        });
      }
    });
  }

}
