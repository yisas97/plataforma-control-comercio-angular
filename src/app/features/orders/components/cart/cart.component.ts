import {Component, inject, OnInit, signal} from '@angular/core';
import {CartItemComponent} from '../cart-item/cart-item.component';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {CartService} from '../../services/cart.service';
import {Cart} from '../../model/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  private cartService = inject(CartService);

  cart = signal<Cart | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando carrito', err);
        this.isLoading.set(false);
      }
    });
  }

  onUpdateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.onRemoveItem(productId);
      return;
    }

    this.cartService.updateCartItem(productId, quantity).subscribe({
      next: (updatedCart) => {
        this.cart.set(updatedCart);
      },
      error: (err) => console.error('Error actualizando cantidad', err)
    });
  }

  onRemoveItem(productId: number): void {
    this.cartService.removeCartItem(productId).subscribe({
      next: (updatedCart) => {
        this.cart.set(updatedCart);
      },
      error: (err) => console.error('Error eliminando producto', err)
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart.set({ items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 });
      },
      error: (err) => console.error('Error vaciando carrito', err)
    });
  }

}
