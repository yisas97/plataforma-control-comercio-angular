import {inject, Injectable, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {CartItem} from '../../orders/model/cart.model';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AddToCartRequest} from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  cartItems = signal<CartItem[]>([]);
  cartCount = signal<number>(0);
  cartTotal = signal<number>(0);

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/items`).pipe(
      tap(items => {
        this.cartItems.set(items);
        this.updateCartSummary(items);
      })
    );
  }

  /**
   * Agregar producto al carrito
   */
  addToCart(request: AddToCartRequest): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/add`, request).pipe(
      tap(() => {
        this.getCartItems().subscribe();
      })
    );
  }

  /**
   * Actualizar cantidad de un item
   */
  updateCartItem(itemId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/items/${itemId}`, { quantity }).pipe(
      tap(() => {
        this.getCartItems().subscribe();
      })
    );
  }

  /**
   * Eliminar item del carrito
   */
  removeFromCart(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${itemId}`).pipe(
      tap(() => {
        this.getCartItems().subscribe();
      })
    );
  }

  /**
   * Limpiar todo el carrito
   */
  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`).pipe(
      tap(() => {
        this.cartItems.set([]);
        this.cartCount.set(0);
        this.cartTotal.set(0);
      })
    );
  }

  /**
   * Actualizar resumen del carrito
   */
  private updateCartSummary(items: CartItem[]) {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    this.cartCount.set(count);
    this.cartTotal.set(total);
  }

  /**
   * Inicializar carrito al cargar la aplicación
   */
  initializeCart() {
    this.getCartItems().subscribe();
  }
}
