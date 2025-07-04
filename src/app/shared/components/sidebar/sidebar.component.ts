import {Component, HostBinding, inject, Input, OnInit} from '@angular/core';
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
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  private authService = inject(AuthService);

  @HostBinding('class.collapsed')
  get isCollapsed() {
    return this.collapsed;
  }

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
    switch (this.userRole) {
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
          {label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard'},
        ]
      },
      /**
      {
        title: 'Usuarios',
        items: [
          {label: 'Gestión de Usuarios', icon: 'people', route: '/admin/users'},
          {label: 'Productores Pendientes', icon: 'pending', route: '/admin/producers/pending'}
        ]
      },
        **/
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
    this.sidebarGroups = [
      {
        title: 'Administración',
        items: [
          {label: 'Dashboard', icon: 'dashboard', route: '/producer/dashboard'},
        ]
      },
      {
        title: 'Mi Perfil de Tienda',
        items: [
          {label: 'Mis Pedidos', icon: 'receipt', route: '/producer/orders'}
        ]
      },
      {
        title: 'Productos',
        items: [
          {
            label: 'Mi Inventario',
            icon: 'inventory',
            route: '/producer/products'
          }
        ]
      }
    ];
  }

  loadClientMenu() {
    this.sidebarGroups = [
      {
        title: 'MARKETPLACE',
        items: [
          {label: 'Inicio', icon: 'home', route: '/marketplace'},
          {label: 'Recomendaciones', icon: 'category', route: '/marketplace/recommendations' },
        ]
      },
      {
        title: 'COMPRAS',
        items: [
          {label: 'Carrito de Compra', icon: 'shopping_cart', route: '/marketplace/cart'},
          {label: 'Mis Pedidos', icon: 'receipt', route: '/pedidos/order'},
          {label: 'Historial de Compras', icon: 'history', route: '/marketplace/purchase-history'}
        ]
      },
    ];
  }

  loadGuestMenu() {
    // Menú básico para usuarios no autenticados
  }

  toggleSubMenu(item: SidebarItem) {
    item.expanded = !item.expanded;
  }
}
