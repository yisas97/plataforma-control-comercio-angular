import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {CommonModule} from '@angular/common';
import {PrimeTemplate} from 'primeng/api';

@Component({
  selector: 'app-confirmation-modal',
  imports: [
    CommonModule,
    Button,
    Dialog,
    PrimeTemplate
  ],
  templateUrl: './confirmation-modal.component.html',
  standalone: true,
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  @Input() visible: boolean = false;
  @Input() header: string = 'Confirmación';
  @Input() message: string = '¿Está seguro que desea realizar esta acción?';
  @Input() confirmLabel: string = 'Aceptar';
  @Input() confirmIcon: string = 'pi pi-check';
  @Input() confirmClass: string = 'p-button-danger';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
    this.visible = false;
  }

  onCancel(): void {
    this.cancel.emit();
    this.visible = false;
  }
}
