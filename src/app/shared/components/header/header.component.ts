import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../core/services';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Input() isSidebarOpen: boolean = true;

  @Output() toggleSidebar = new EventEmitter<void>();

  private authService = inject(AuthService);

  userName: string = '';
  userAvatar: string = '';
  userRole: string = '';
  userBasePath: string = '';
  notificationCount: number = 0;
  cartItemCount: number = 0;
  userMenuOpen: boolean = false;

  ngOnInit() {
    // Obtener datos del usuario autenticado
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
      this.userAvatar = user.avatar;
      this.userRole = user.role;

      // Determinar la ruta base según el rol
      switch(this.userRole) {
        case 'ADMIN':
          this.userBasePath = 'admin';
          break;
        case 'ROLE_PRODUCER':
          this.userBasePath = 'producer';
          break;
        case 'CLIENT':
          this.userBasePath = 'client';
          break;
      }

      // Simulación de notificaciones y carrito
      this.notificationCount = 3;
      this.cartItemCount = 2;
    }
  }

  toggleSidebarEvent() {
    this.toggleSidebar.emit();
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

}
