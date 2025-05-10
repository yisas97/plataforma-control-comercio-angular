import { Component } from '@angular/core';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {SidebarComponent} from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent, HeaderComponent, SidebarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
