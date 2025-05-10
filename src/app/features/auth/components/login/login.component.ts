import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth.service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isSubmitting = false;

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.authService.setSession(response);
        this.redirectBasedOnRole();
      },
      error: (error) => {
        console.error(error);
        // Implementación de alerta de error (puedes usar SweetAlert2)
        this.isSubmitting = false;
      }
    });
  }

  redirectBasedOnRole() {
    if (this.authService.hasRole('ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.hasRole('PRODUCER')) {
      this.router.navigate(['/producer/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

}
