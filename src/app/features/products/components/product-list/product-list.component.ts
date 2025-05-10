import {Component, inject, OnInit, signal} from '@angular/core';
import {FilterPipe} from '../../../../shared/pipes/filter.pipe';
import {LoadingSpinnerComponent} from '../../../../shared/components/loading-spinner/loading-spinner.component';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ProductService} from '../../services/product.service';
import {Product} from '../../model/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingSpinnerComponent, FilterPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  private productService = inject(ProductService);

  // Signals para el estado local (nuevo en Angular)
  products = signal<Product[]>([]);
  isLoading = signal(false);
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.isLoading.set(false);
      }
    });
  }

  updateSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
}
