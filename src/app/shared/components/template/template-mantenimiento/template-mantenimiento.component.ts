import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {Table, TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {ConfirmationModalComponent, FormModalComponent} from '../../modal';

export interface ColumnDefinition {
  field: string;
  header: string;
  type?: 'text' | 'number' | 'decimal' | 'boolean' | 'currency';
  format?: {
    decimals?: number;
    useGrouping?: boolean;
    trueLabel?: string;
    falseLabel?: string;
    trueClass?: string;
    falseClass?: string;
  };
  cssClass?: string;
}

@Component({
  selector: 'app-template-mantenimiento',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    FormModalComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './template-mantenimiento.component.html',
  standalone: true,
  styleUrl: './template-mantenimiento.component.scss'
})
export class TemplateMantenimientoComponent<T extends { id?: number }> implements OnInit, AfterViewInit{
  @ViewChild('dt') table!: Table;

  @Input() title: string = 'Mantenimiento';
  @Input() items: T[] = [];
  @Input() cols: ColumnDefinition[] = [];
  @Input() loading: boolean = false;
  @Input() actionTemplate: TemplateRef<any> | null = null;
  @Input() formTemplate: TemplateRef<any> | null = null;
  @Input() tableClass: string = 'p-datatable-gridlines p-datatable-sm';
  @Input() form: FormGroup | null = null;
  @Input() rowsPerPage: number = 10;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() save = new EventEmitter<T>();
  @Output() cancel = new EventEmitter<void>();
  @Output() formInit = new EventEmitter<T>();

  selectedItem: T | null = null;
  showFormModal: boolean = false;
  showDeleteModal: boolean = false;
  itemToDelete: T | null = null;

  globalFilterFields: string[] = [];
  formIsValid: boolean = false;

  ngOnInit() {
    this.globalFilterFields = this.cols.map(col => col.field);
  }

  ngAfterViewInit() {
    // Asegura que los dropdowns de paginación se muestren correctamente
    if (this.table) {
      const paginatorEl = this.table.el.nativeElement.querySelector('.p-paginator-bottom');
      if (paginatorEl) {
        const dropdownEl = paginatorEl.querySelector('.p-dropdown');
        if (dropdownEl) {
          // Establece el appendTo a "body" para que se muestre correctamente
          dropdownEl.setAttribute('appendTo', 'body');
        }
      }
    }
  }

  onGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.table) {
      this.table.filterGlobal(filterValue, 'contains');
    }
  }

  onAdd(): void {
    this.selectedItem = {} as T;
    this.showFormModal = true;
    this.add.emit();
    this.formInit.emit(this.selectedItem);
  }

  onEdit(item: T): void {
    this.selectedItem = {...item as object} as T;
    this.showFormModal = true;
    this.edit.emit(item);
    this.formInit.emit(this.selectedItem);
  }

  onDeleteClick(item: T): void {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  onDeleteConfirm(): void {
    if (this.itemToDelete) {
      this.delete.emit(this.itemToDelete);
    }
    this.showDeleteModal = false;
  }

  onSave(): void {
    if (this.form && this.form.valid && this.selectedItem) {
      // Combinamos los valores del formulario con el item seleccionado
      const formValues = this.form.value;
      const updatedItem = { ...this.selectedItem, ...formValues };
      this.save.emit(updatedItem);
      this.showFormModal = false;
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.form?.reset();
  }

  getFormHeader(): string {
    return this.selectedItem && 'id' in this.selectedItem && this.selectedItem.id
      ? 'Editar'
      : 'Nuevo';
  }

  updateFormValidity(isValid: boolean): void {
    this.formIsValid = isValid;
  }

  formatCellValue(value: any, col: ColumnDefinition): string {
    if (value === null || value === undefined) {
      return '';
    }

    switch (col.type) {
      case 'decimal':
      case 'number':
        const decimals = col.format?.decimals ?? (col.type === 'decimal' ? 2 : 0);
        const useGrouping = col.format?.useGrouping ?? true;
        return new Intl.NumberFormat('es-PE', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          useGrouping: useGrouping
        }).format(value);

      case 'currency':
        return new Intl.NumberFormat('es-PE', {
          style: 'currency',
          currency: 'PEN',
          minimumFractionDigits: col.format?.decimals ?? 2,
          maximumFractionDigits: col.format?.decimals ?? 2,
        }).format(value);

      case 'boolean':
        return value ?
          (col.format?.trueLabel ?? 'Sí') :
          (col.format?.falseLabel ?? 'No');

      default:
        return String(value);
    }
  }

  getCellClass(value: any, col: ColumnDefinition): string {
    let classes = col.cssClass || '';

    switch (col.type) {
      case 'number':
      case 'decimal':
      case 'currency':
        classes += ' text-right';
        break;

      case 'boolean':
        if (value) {
          classes += ` ${col.format?.trueClass || 'text-green-500'}`;
        } else {
          classes += ` ${col.format?.falseClass || 'text-red-500'}`;
        }
        break;
    }

    return classes;
  }
}
