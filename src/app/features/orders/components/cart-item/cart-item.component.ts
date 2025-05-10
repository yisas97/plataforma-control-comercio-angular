import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CartItem} from '../../model/cart.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-cart-item',
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  standalone: true,
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() updateQuantity = new EventEmitter<number>();
  @Output() removeItem = new EventEmitter<void>();

  onQuantityChange(quantity: number): void {
    this.updateQuantity.emit(quantity);
  }

  onRemove(): void {
    this.removeItem.emit();
  }
}
