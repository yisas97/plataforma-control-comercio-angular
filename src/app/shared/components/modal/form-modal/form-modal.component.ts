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
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() header: string = 'Formulario';
  @Input() item: T | null = null;
  @Input() formTemplate: TemplateRef<any> | null = null;
  @Input() formIsValid: boolean = false;

  @Output() save = new EventEmitter<T>();
  @Output() cancel = new EventEmitter<void>();

  onSave(): void {
    if (this.item) {
      this.save.emit(this.item);
    }
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onCancel(): void {
    this.cancel.emit();
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
