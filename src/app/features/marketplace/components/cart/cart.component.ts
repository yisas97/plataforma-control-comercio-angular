import {Component, inject, OnInit} from '@angular/core';
import {CartItem} from '../../../orders/model/cart.model';
import {CartService} from '../../services/cart.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MessageService} from 'primeng/api';
import {InputNumber} from 'primeng/inputnumber';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Card,
    Button,
    ReactiveFormsModule,
    InputNumber,
    ToastModule
  ],
  providers: [MessageService],
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  private cartService = inject(CartService);
  private messageService = inject(MessageService);

  cartItems = this.cartService.cartItems;
  cartTotal = this.cartService.cartTotal;
  loading = false;

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.loading = true;
    this.cartService.getCartItems().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el carrito'
        });
      }
    });
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity < 1) {
      this.removeItem(item);
      return;
    }

    if (item.id) {
      this.cartService.updateCartItem(item.id, newQuantity).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Cantidad actualizada'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar cantidad'
          });
        }
      });
    }
  }

  removeItem(item: CartItem) {
    if (item.id) {
      this.cartService.removeFromCart(item.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Producto eliminado del carrito'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar producto'
          });
        }
      });
    }
  }

  clearCart() {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Carrito limpio',
          detail: 'Todos los productos han sido eliminados'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al limpiar el carrito'
        });
      }
    });
  }
}
