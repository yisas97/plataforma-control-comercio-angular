import { Component } from '@angular/core';
import {ColumnDefinition, TemplateMantenimientoComponent} from '../../../../shared/components';
import {Category} from '../../model/category.model';
import {CategoryService} from '../../services';
import {Checkbox} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-category-management',
  imports: [
    TemplateMantenimientoComponent,
    Checkbox,
    FormsModule,
    InputText
  ],
  templateUrl: './category-management.component.html',
  standalone: true,
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent {

  categories: Category[] = [];
  loading: boolean = false;
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

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
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
    if (category.id) {
      this.categoryService.updateCategory(category.id,category).subscribe(() => {
        this.loadCategories();
      });
    } else {
      this.categoryService.createCategory(category).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  deleteCategory(category: Category) {
    if (category.id) {
      this.categoryService.deleteCategory(category.id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

}
