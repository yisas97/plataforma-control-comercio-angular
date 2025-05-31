import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {OrderService} from '../../services/order.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {Button} from 'primeng/button';
import {CartService} from '../../../marketplace/services/cart.service';
import {RadioButton} from 'primeng/radiobutton';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Button, RadioButton, Card],
  providers: [MessageService],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  cartItems = this.cartService.cartItems;
  cartTotal = this.cartService.cartTotal;

  checkoutForm: FormGroup;
  isProcessing = signal(false);

  paymentMethods = [
    { label: 'Tarjeta de Crédito', value: 'CREDIT_CARD' },
    { label: 'Tarjeta de Débito', value: 'DEBIT_CARD' },
    { label: 'PayPal', value: 'PAYPAL' },
    { label: 'Transferencia Bancaria', value: 'BANK_TRANSFER' },
    { label: 'Efectivo contra entrega', value: 'CASH_ON_DELIVERY' }
  ];

  constructor() {
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', [Validators.required, Validators.minLength(10)]],
      paymentMethod: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    // Verificar si hay items en el carrito
    if (this.cartItems().length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Carrito vacío',
        detail: 'Agrega productos antes de proceder al checkout'
      });
      this.router.navigate(['/marketplace']);
    }
  }

  onSubmit() {
    if (this.checkoutForm.valid && this.cartItems().length > 0) {
      this.isProcessing.set(true);

      const orderData = {
        shippingAddress: this.checkoutForm.value.shippingAddress,
        paymentMethod: this.checkoutForm.value.paymentMethod,
        notes: this.checkoutForm.value.notes,
        items: this.cartItems().map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      this.orderService.createOrder(orderData).subscribe({
        next: (order) => {
          this.isProcessing.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Pedido creado',
            detail: `Tu pedido #${order.id} ha sido creado exitosamente`
          });

          // Limpiar carrito y redirigir
          this.cartService.clearCart().subscribe(() => {
            this.router.navigate(['/client/orders']);
          });
        },
        error: (error) => {
          this.isProcessing.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo procesar tu pedido. Intenta nuevamente.'
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      this.checkoutForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} es obligatorio`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }
}
