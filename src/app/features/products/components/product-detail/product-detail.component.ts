import {Component, inject, OnInit, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {Carousel} from 'primeng/carousel';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {Toast} from 'primeng/toast';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {CartService} from '../../../orders/services/cart.service';
import {MessageService} from 'primeng/api';
import {BlockchainService} from '../../services/blockchain.service';
import {CertificateData, ProductCertificate} from '../../model/blockchain.model';
import {Product} from '../../model/product.model';
import {InputNumber} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    Button,
    Dialog,
    Carousel,
    Card,
    Tag,
    Toast,
    InputNumber,
    FormsModule
  ],
  templateUrl: './product-detail.component.html',
  providers: [ProductService, MessageService],
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  loading = signal(false);

  selectedQuantity = 1;
  selectedImageIndex = 0;
  favoriteStatus = false;

  showCertificateModal = false;
  selectedCertificate: ProductCertificate | null = null;
  certificateData: CertificateData | null = null;
  loadingCertificate = false;
  carouselResponsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  private blockchainService = inject(BlockchainService);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProduct(+productId);
      }
    });
  }

  private loadProduct(productId: number) {
    this.loading.set(true);

    this.productService.getProductDetail(productId).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
        this.loadRelatedProducts();

        console.log('✅ Producto cargado y vista trackeada por IA');
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el producto'
        });
      }
    });
  }

  private loadRelatedProducts() {
    let categoria = this.product()?.category;
    if (categoria) {
      this.productService.getRelatedProductsByCategory(categoria).subscribe({
        next: (products) => {
          const filtered = products
            .filter(p => p.id !== this.product()?.id)
            .slice(0, 20);
          this.relatedProducts.set(filtered);
        },
        error: (error) => {
          console.error('Error loading related products:', error);
        }
      });
    }
  }

  getCurrentImage(): string {
    const images = this.getProductImages();
    return images[this.selectedImageIndex] || images[0];
  }

  getProductImages(): string[] {
    const defaultImage = `https://primefaces.org/cdn/primeng/images/demo/product/${this.product()?.image || 'product-placeholder.jpg'}`;
    return [defaultImage];
  }

  getProductImage(product: Product): string {
    return `https://primefaces.org/cdn/primeng/images/demo/product/${product.image || 'product-placeholder.jpg'}`;
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  getStockStatus(): string {
    const product = this.product();
    if (!product) return 'AGOTADO';

    if (product.quantity === 0) return 'AGOTADO';
    if (product.quantity < 10) return 'BAJO STOCK';
    return 'EN STOCK';
  }

  getStockSeverity() {
    switch (this.getStockStatus()) {
      case 'EN STOCK':
        return 'success';
      case 'BAJO STOCK':
        return 'warning';
      case 'AGOTADO':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStarArray(): number[] {
    const rating = this.product()?.rating || 0;
    return Array(Math.floor(rating)).fill(0);
  }

  getReviewCount(): number {
    return 35;
  }

  getMaxQuantity(): number {
    return this.product()?.quantity || 0;
  }

  isInStock(): boolean {
    return (this.product()?.quantity || 0) > 0;
  }

  isFavorite(): boolean {
    return this.favoriteStatus;
  }

  addToCart() {
    const product = this.product();
    if (!product || !product.id) return;

    this.cartService.addToCart(
      {
        productId: product.id,
        quantity: this.selectedQuantity
      }
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Agregado al carrito',
          detail: `${product.name} (${this.selectedQuantity} unidades) ha sido agregado a tu carrito`
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

  toggleFavorite() {
    const product = this.product();
    if (!product || !product.id) return;
    this.productService.toggleFavorite(product.id).subscribe({
      next: () => {
        this.favoriteStatus = !this.favoriteStatus;
        this.messageService.add({
          severity: 'success',
          summary: this.favoriteStatus ? 'Agregado a favoritos' : 'Removido de favoritos',
          detail: `${product.name} ${this.favoriteStatus ? 'agregado a' : 'removido de'} tus favoritos`
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

  buyNow() {
    this.addToCart();
    setTimeout(() => {
      this.router.navigate(['/cart']);
    }, 1000);
  }

  showCertificate() {
    const product = this.product();
    if (!product?.id) return;

    this.showCertificateModal = true;
    this.loadingCertificate = true;
    this.selectedCertificate = null;
    this.certificateData = null;

    this.blockchainService.getCertificate(product.id).subscribe({
      next: (certificate) => {
        this.selectedCertificate = certificate;

        try {
          if (certificate.certificateData) {
            this.certificateData = JSON.parse(certificate.certificateData);
          }
        } catch (error) {
          console.error('Error parsing certificate data:', error);
          this.messageService.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'No se pudo procesar la información del certificado'
          });
        }

        this.loadingCertificate = false;
      },
      error: (error) => {
        console.error('Error loading certificate:', error);
        this.loadingCertificate = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el certificado blockchain'
        });
      }
    });
  }

  closeCertificateModal() {
    this.showCertificateModal = false;
    this.selectedCertificate = null;
    this.certificateData = null;
  }

  viewProduct(productId: number) {
    this.router.navigate(['/marketplace/product', productId]);
  }

  goBack() {
    this.router.navigate(['/marketplace']);
  }
}
