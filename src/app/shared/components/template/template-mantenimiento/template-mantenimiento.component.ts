import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
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
    FormsModule,
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
export class TemplateMantenimientoComponent<T extends { id?: number }> {
  @Input() title: string = 'Mantenimiento';
  @Input() items: T[] = [];
  @Input() cols: ColumnDefinition[] = [];
  @Input() loading: boolean = false;
  @Input() actionTemplate: TemplateRef<any> | null = null;
  @Input() formTemplate: TemplateRef<any> | null = null;
  @Input() tableClass: string = 'p-datatable-gridlines p-datatable-sm';

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() save = new EventEmitter<T>();
  @Output() cancel = new EventEmitter<void>();

  selectedItem: T | null = null;
  showFormModal: boolean = false;
  showDeleteModal: boolean = false;
  itemToDelete: T | null = null;

  globalFilterFields: string[] = [];

  ngOnInit() {
    this.globalFilterFields = this.cols.map(col => col.field);
  }

  onAdd(): void {
    this.selectedItem = {} as T;
    this.showFormModal = true;
    this.add.emit();
  }

  onEdit(item: T): void {
    this.selectedItem = {...item as object} as T;
    this.showFormModal = true;
    this.edit.emit(item);
  }

  onDeleteClick(item: T): void {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  onDeleteConfirm(): void {
    if (this.itemToDelete) {
      this.delete.emit(this.itemToDelete);
    }
  }

  onSave(item: T): void {
    this.save.emit(item);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getFormHeader(): string {
    return this.selectedItem && 'id' in this.selectedItem && this.selectedItem.id
      ? 'Editar'
      : 'Nuevo';
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
