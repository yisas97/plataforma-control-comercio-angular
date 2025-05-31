import { Component } from '@angular/core';
import {ColumnDefinition, TemplateMantenimientoComponent} from '../../../../shared/components';
import {Category} from '../../model/category.model';
import {CategoryService} from '../../services';
import {Checkbox, CheckboxModule} from 'primeng/checkbox';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-category-management',
  imports: [
    CommonModule,
    TemplateMantenimientoComponent,
    CheckboxModule,
    ReactiveFormsModule,
    InputTextModule,
    InputText
  ],
  templateUrl: './category-management.component.html',
  standalone: true,
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent {

  categories: Category[] = [];
  loading: boolean = false;
  categoryForm!: FormGroup;

  columns: ColumnDefinition[] = [
    {
      field: 'id',
      header: 'ID',
      type: 'number',
      cssClass: 'font-semibold'
    },
    {
      field: 'name',
      header: 'Nombre',
      type: 'text'
    },
    {
      field: 'description',
      header: 'Descripción',
      type: 'text'
    },
    {
      field: 'active',
      header: 'Activo',
      type: 'boolean',
      format: {
        trueLabel: 'Sí',
        falseLabel: 'No',
        trueClass: 'text-green-600 font-medium',
        falseClass: 'text-red-600 font-medium'
      }
    },
  ];

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.categoryForm = this.createForm();
    this.loadCategories();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      active: [true]
    });
  }

  initForm(category: Category) {
    this.categoryForm.reset();
    if (category) {
      this.categoryForm.patchValue({
        name: category.name || '',
        description: category.description || '',
        active: category.active === undefined ? true : category.active
      });
    }
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando categorías', error);
        this.loading = false;
      }
    });
  }

  saveCategory(category: Category) {
    const formValues = this.categoryForm.value;
    const updatedCategory = { ...category, ...formValues };

    if (updatedCategory.id) {
      this.categoryService.updateCategory(updatedCategory.id, updatedCategory).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error al actualizar la categoría', error);
        }
      });
    } else {
      this.categoryService.createCategory(updatedCategory).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error al crear la categoría', error);
        }
      });
    }
  }

  deleteCategory(category: Category) {
    if (category.id) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error al eliminar la categoría', error);
        }
      });
    }
  }

}
