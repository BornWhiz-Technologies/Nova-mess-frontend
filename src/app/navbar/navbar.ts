import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
//import { SectionService } from '../services/section.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  isSidebarOpen = false;
  isLoggedIn = false;
  role = '';
  isDashboard = false;
  activeSection = 'dashboard';

  managerMenuItems: any[] = [
    { label: 'Dashboard', icon: 'dashboard', section: 'dashboard' },
    { label: 'Menu Management', icon: 'restaurant_menu', section: 'menu' },
    { label: 'Orders', icon: 'shopping_cart', section: 'orders' },
    { label: 'Students', icon: 'people', section: 'students' },
    { label: 'Reports', icon: 'feedback', section: 'reports' },
    { label: 'Analytics', icon: 'bar_chart', section: 'analytics' },
    { label: 'Notifications', icon: 'notifications', section: 'notifications' },
    { label: 'Profile', icon: 'person', section: 'profile' },
  ];

  studentMenuItems: any[] = [
    { label: 'Dashboard', icon: 'dashboard', section: 'dashboard' },
    { label: 'Menu', icon: 'restaurant_menu', section: 'menu' },
    { label: 'Orders', icon: 'shopping_cart', section: 'orders' },
    { label: 'Profile', icon: 'person', section: 'profile' },
  ];

  adminMenuItems: any[] = [
    { label: 'Dashboard', icon: 'dashboard', section: 'dashboard' },
    { label: 'Managers', icon: 'badge', section: 'managers' },
    { label: 'Students', icon: 'people', section: 'students' },
    { label: 'Reports', icon: 'assessment', section: 'reports' },
  ];

  generalMenuItems: any[] = [
    { label: 'Home', icon: 'home', route: '/' },
    { label: 'About', icon: 'info', route: '/about' },
    { label: 'Contact', icon: 'mail', route: '/contact' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuth();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.checkAuth();
    });
  }

  checkAuth() {
    const token = localStorage.getItem('token');

    this.role = localStorage.getItem('role') || '';

    const url = this.router.url;

    this.isLoggedIn = !!(token && this.role);

    this.isDashboard =
      url.includes('/manager-dashboard') ||
      url.includes('/student-dashboard') ||
      url.includes('/admin-dashboard');

    // Get active section from URL
    const queryPart = url.split('?')[1];

    if (queryPart) {
      const params = new URLSearchParams(queryPart);

      const section = params.get('section');

      this.activeSection = section || 'dashboard';
    } else {
      this.activeSection = 'dashboard';
    }
  }

  get currentMenuItems() {
    if (!this.isLoggedIn) {
      return this.generalMenuItems;
    }
    if (!this.isDashboard) {
      return [];
    }

    switch (this.role) {
      case 'manager':
        return this.managerMenuItems;
      case 'student':
        return this.studentMenuItems;
      case 'admin':
        return this.adminMenuItems;
      default:
        return [];
    }
  }

  get showAuthButtons() {
    return !this.isLoggedIn;
  }

  get showUserRole() {
    return this.isLoggedIn && this.isDashboard;
  }

  getDashboardRoute(): string {
    switch (this.role.toLowerCase()) {
      case 'manager':
        return '/manager-dashboard';
      case 'student':
        return '/student-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/';
    }
  }

  getMenuRoute(item: any): string {
    return item.route || this.getDashboardRoute();
  }

  getMenuQueryParams(item: any) {
    return item.section ? { section: item.section } : null;
  }

  onMenuClick(item: any) {
    if (item.section) {
      this.activeSection = item.section;
    }

    this.isSidebarOpen = false;
  }
  toggleSidebar(event: Event) {
    event.stopPropagation();
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onOverlayClick() {
    this.isSidebarOpen = false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
