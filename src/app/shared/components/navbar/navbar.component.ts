import {Component, inject, signal} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-navbar',
  imports: [
    RouterLinkActive, CommonModule, RouterLink
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private authService = inject(AuthService);

  isMenuOpen = signal(false);

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    console.log(this.authService.hasRole('ADMIN'));
    return this.authService.hasRole('ADMIN');
  }

  get isProducer(): boolean {
    return this.authService.hasRole('PRODUCER');
  }

  get userName(): string {
    return this.authService.getCurrentUser()?.name || '';
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  logout(): void {
    this.authService.logout();
  }
}
