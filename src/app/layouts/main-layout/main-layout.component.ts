import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {SidebarComponent} from '../../shared/components/sidebar/sidebar.component';
import {HeaderComponent} from '../../shared/components/header/header.component';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, FooterComponent, SidebarComponent, HeaderComponent],
  templateUrl: './main-layout.component.html',
  standalone: true,
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
