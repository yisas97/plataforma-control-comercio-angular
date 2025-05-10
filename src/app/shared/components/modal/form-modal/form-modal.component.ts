import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {Button, ButtonModule} from 'primeng/button';
import {Dialog, DialogModule} from 'primeng/dialog';
import {PrimeTemplate} from 'primeng/api';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-form-modal',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-modal.component.html',
  standalone: true,
  styleUrl: './form-modal.component.scss'
})
export class FormModalComponent<T> {
  @Input() header: string = 'Formulario';
  @Input() visible: boolean = false;
  @Input() formTemplate: TemplateRef<any> | null = null;
  @Input() formIsValid: boolean = false;
  @Input() item: any = null;
  @Input() saveLabel: string = 'Guardar';
  @Input() cancelLabel: string = 'Cancelar';
  @Input() saveIcon: string = 'pi pi-check';
  @Input() cancelIcon: string = 'pi pi-times';
  @Input() width: string = '70%';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onHide(): void {
    this.visibleChange.emit(false);
  }

  onSave(): void {
    if (this.formIsValid) {
      this.save.emit();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
