import {Component, inject, Input} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {SidebarGroup, SidebarItem} from './sidebar.model';
import {AuthService} from '../../../core/services';
import {PERFILES} from '../../utils/perfi.utils';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() collapsed = false;
  private authService = inject(AuthService);

  sidebarGroups: SidebarGroup[] = [];
  userRole: string = '';

  ngOnInit() {
    this.userRole = this.authService.getCurrentUser()?.role || '';
    console.log(this.authService.getCurrentUser());
    console.log(this.userRole);
    this.loadSidebarMenu();
  }

  loadSidebarMenu() {
    // Cargar menú según el rol
    switch(this.userRole) {
      case PERFILES.ADMIN:
        this.loadAdminMenu();
        break;
      case PERFILES.PRODUCER:
        this.loadProducerMenu();
        break;
      case PERFILES.CLIENT:
        this.loadClientMenu();
        break;
      default:
        // Menú de invitado
        this.loadGuestMenu();
    }
  }

  loadAdminMenu() {
    this.sidebarGroups = [
      {
        title: 'Administración',
        items: [
          { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
          { label: 'Estadísticas', icon: 'bar_chart', route: '/admin/statistics' }
        ]
      },
      {
        title: 'Usuarios',
        items: [
          { label: 'Gestión de Usuarios', icon: 'people', route: '/admin/users' },
          { label: 'Productores Pendientes', icon: 'pending', route: '/admin/producers/pending' }
        ]
      },
      {
        title: 'Catálogo',
        items: [
          {
            label: 'Gestión de Categorias',
            icon: 'category',
            route: '/admin/categories',
          }
        ]
      }
    ];
  }

  loadProducerMenu() {
    // Similar al admin pero con opciones de productor
  }

  loadClientMenu() {
    // Similar pero con opciones de cliente
  }

  loadGuestMenu() {
    // Menú básico para usuarios no autenticados
  }

  toggleSubMenu(item: SidebarItem) {
    item.expanded = !item.expanded;
  }
}
