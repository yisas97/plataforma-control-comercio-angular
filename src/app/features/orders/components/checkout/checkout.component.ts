import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Cart} from '../../model/cart.model';
import {OrderService} from '../../services/order.service';
import {CartService} from '../../services/cart.service';
import {Router} from '@angular/router';
import {PaymentMethod} from '../../model/payment.model';
import {PaymentService} from '../../services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  cart = signal<Cart | null>(null);
  isLoading = signal(false);
  paymentMethods = signal<PaymentMethod[]>([]);

  shippingForm!: FormGroup;
  paymentForm!: FormGroup;

  ngOnInit(): void {
    this.initForms();
    this.loadCart();
    this.loadPaymentMethods();
  }

  initForms(): void {
    this.shippingForm = this.fb.group({
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]]
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['credit_card', [Validators.required]],
      cardNumber: [''],
      expiryDate: [''],
      cvv: ['']
    });
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart.set(data);
        this.isLoading.set(false);

        // Redirigir si el carrito está vacío
        if (data.items.length === 0) {
          this.router.navigate(['/carrito']);
        }
      },
      error: (err) => {
        console.error('Error cargando carrito', err);
        this.isLoading.set(false);
        this.router.navigate(['/carrito']);
      }
    });
  }

  loadPaymentMethods(): void {
    this.paymentService.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods.set(methods);
      },
      error: (err) => {
        console.error('Error cargando métodos de pago', err);
        // Establecer métodos de pago por defecto
        this.paymentMethods.set([
          { id: 'credit_card', name: 'Tarjeta de Crédito/Débito' },
          { id: 'paypal', name: 'PayPal' },
          { id: 'cash_on_delivery', name: 'Pago contra entrega' }
        ]);
      }
    });
  }

  onPaymentMethodChange(method: string): void {
    const cardFields = ['cardNumber', 'expiryDate', 'cvv'];

    if (method === 'credit_card') {
      cardFields.forEach(field => {
        this.paymentForm.get(field)?.setValidators(Validators.required);
      });
    } else {
      cardFields.forEach(field => {
        this.paymentForm.get(field)?.clearValidators();
        this.paymentForm.get(field)?.setValue('');
      });
    }

    cardFields.forEach(field => {
      this.paymentForm.get(field)?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.shippingForm.invalid || this.paymentForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.shippingForm.controls).forEach(key => {
        this.shippingForm.get(key)?.markAsTouched();
      });

      Object.keys(this.paymentForm.controls).forEach(key => {
        this.paymentForm.get(key)?.markAsTouched();
      });

      return;
    }

    this.isLoading.set(true);

    // Crear dirección de envío completa
    const shippingData = this.shippingForm.value;
    const shippingAddress = `${shippingData.fullName}, ${shippingData.phone}, ${shippingData.address}, ${shippingData.city}, ${shippingData.zipCode}`;

    // Preparar información de pago
    const paymentInfo = {
      paymentMethod: this.paymentForm.get('paymentMethod')?.value,
      ...(this.paymentForm.get('paymentMethod')?.value === 'credit_card' && {
        cardNumber: this.paymentForm.get('cardNumber')?.value,
        expiryDate: this.paymentForm.get('expiryDate')?.value,
        cvv: this.paymentForm.get('cvv')?.value
      })
    };

    // Crear el pedido
    const orderRequest = {
      shippingAddress,
      paymentMethod: paymentInfo.paymentMethod
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        // Si el pago es con tarjeta, procesarlo
        if (paymentInfo.paymentMethod === 'credit_card') {
          this.paymentService.processPayment(paymentInfo, order.id).subscribe({
            next: () => {
              this.isLoading.set(false);
              this.router.navigate(['/pedidos/confirmation', order.id]);
            },
            error: (err) => {
              console.error('Error procesando pago', err);
              this.isLoading.set(false);
              // En un caso real, habría que implementar la lógica adecuada para manejar fallos en el pago
              this.router.navigate(['/pedidos/confirmation', order.id]);
            }
          });
        } else {
          this.isLoading.set(false);
          this.router.navigate(['/pedidos/confirmation', order.id]);
        }
      },
      error: (err) => {
        console.error('Error creando pedido', err);
        this.isLoading.set(false);
      }
    });
  }
}
