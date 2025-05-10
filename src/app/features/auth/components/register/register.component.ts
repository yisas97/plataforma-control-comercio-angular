import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isSubmitting = false;
  currentYear = new Date().getFullYear();

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isSubmitting = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.authService.setSession(response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error(error);
        // Implementación de alerta de error (puedes usar SweetAlert2)
        this.isSubmitting = false;
      }
    });
  }

}
