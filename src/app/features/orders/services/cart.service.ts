import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Cart, CartItem} from '../model/cart.model';
import {AddToCartRequest} from '../../marketplace/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  cartItems = signal<CartItem[]>([]);
  cartCount = signal<number>(0);
  cartTotal = signal<number>(0);

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addToCart(request: AddToCartRequest): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/add`, request).pipe(
      tap(() => {
        this.getCartItems().subscribe();
      })
    );
  }

  updateCartItem(productId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/items/${productId}`, { quantity });
  }

  removeCartItem(productId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/items/${productId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/items`).pipe(
      tap(items => {
        this.cartItems.set(items);
        this.updateCartSummary(items);
      })
    );
  }

  private updateCartSummary(items: CartItem[]) {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    this.cartCount.set(count);
    this.cartTotal.set(total);
  }
}
