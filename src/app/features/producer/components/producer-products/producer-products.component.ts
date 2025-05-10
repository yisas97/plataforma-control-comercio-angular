import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Table} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {CheckboxModule} from 'primeng/checkbox';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {ColumnDefinition, TemplateMantenimientoComponent} from '../../../../shared/components';
import {ProductService} from '../../../products/services/product.service';
import {CategoryService} from '../../../admin/services';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-producer-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
    ToastModule,
    TemplateMantenimientoComponent,
    Textarea
  ],
  providers: [MessageService],
  templateUrl: './producer-products.component.html',
  styleUrl: './producer-products.component.scss'
})
export class ProducerProductsComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  @ViewChild('productFormTemplate') productFormTemplate!: TemplateRef<any>;
  @ViewChild('productActionsTemplate') productActionsTemplate!: TemplateRef<any>;


  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  products: any[] = [];
  selectedProduct: any = null;
  productForm!: FormGroup;
  categories: any[] = [];

  loading: boolean = true;
  showFormModal: boolean = false;
  showDeleteModal: boolean = false;

  cols: ColumnDefinition[] = [
    {field: 'name', header: 'Nombre', type: 'text'},
    {field: 'categoryName', header: 'Categoría', type: 'text'},
    {field: 'price', header: 'Precio', type: 'currency', format: {decimals: 2}},
    {field: 'quantity', header: 'Stock', type: 'number'},
  ];

  globalFilterFields: string[] = ['name', 'categoryName'];

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadCategories();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      categoryIds: [[], Validators.required], // Cambiado para manejar múltiples categorías como en el DTO
      description: ['', Validators.maxLength(500)],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]], // Cambiado de 'stock' a 'quantity'
      sku: ['']
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducerProducts().subscribe({
      next: (data) => {
        // Transformar y preparar los datos para mostrarlos en la tabla
        this.products = data.map(product => {
          // Obtener los nombres de las categorías para mostrar
          const categoryNames = product.categoryIds
            ? product.categoryIds.map((catId: number) => {
              const cat = this.categories.find(c => c.id === catId);
              return cat ? cat.name : 'Desconocida';
            }).join(', ')
            : 'Sin categoría';

          return {
            ...product,
            categoryName: categoryNames,
            // Asegurar que tenga el campo 'active' (que parece que no viene del backend)
            active: product.active !== undefined ? product.active : true
          };
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los productos'
        });
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        // Volver a cargar los productos para asegurarnos de tener los nombres de categorías
        if (this.products.length > 0) {
          this.loadProducts();
        }
      },
      error: (error) => {
        console.error('Error loading categories', error);
      }
    });
  }

  onAdd(): void {
    this.selectedProduct = {};
    this.productForm.reset({
      price: 0,
      quantity: 0,
      categoryIds: []
    });

    this.showFormModal = true;
    console.log("Modal Nuevo abierto:", this.showFormModal);

    setTimeout(() => {
      this.showFormModal = true;
    }, 0);
  }

  onEdit(product: any): void {
    this.selectedProduct = product;
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      categoryIds: product.categoryIds || [], // Usar categoryIds del producto
      description: product.description,
      price: product.price,
      quantity: product.quantity, // Cambiado de 'stock' a 'quantity'
      sku: product.sku,
      active: product.active
    });
    console.log(this.productForm.value);
    this.showFormModal = true;
  }

  onDeleteClick(product: any): void {
    this.selectedProduct = product;
    this.showDeleteModal = true;
  }

  onDeleteConfirm(): void {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.productService.deleteProduct(this.selectedProduct.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Producto eliminado correctamente'
          });
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el producto'
          });
        }
      });
    }
  }

  onSave(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const product = this.productForm.value;
    console.log("Guardando producto:", product);

    const productToSave = {
      ...product,
      quantity: product.quantity || 0,
      categoryIds: product.categoryIds || []
    };

    const saveOperation = product.id
      ? this.productService.updateProduct(product.id, productToSave)
      : this.productService.createProduct(productToSave);

    saveOperation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: product.id ? 'Producto actualizado correctamente' : 'Producto creado correctamente'
        });
        this.loadProducts();
        this.showFormModal = false;
      },
      error: (error) => {
        console.error('Error saving product', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: product.id ? 'Error al actualizar el producto' : 'Error al crear el producto'
        });
      }
    });
  }

  navigateToEdit(product: any): void {
    this.router.navigate(['/producer/products/edit', product.id]);
  }
}
