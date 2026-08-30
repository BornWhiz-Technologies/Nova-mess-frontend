import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { NotificationService } from '../services/notification';
import { ProfileService } from '../services/profile';
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
  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;

  profile: any = null;
  showProfile = false;

  managerMenuItems: any[] = [
    { label: 'Dashboard', icon: 'dashboard', section: 'dashboard' },
    { label: 'Menu Management', icon: 'restaurant_menu', section: 'menu' },
    { label: 'Orders', icon: 'shopping_cart', section: 'orders' },
    { label: 'Students', icon: 'people', section: 'students' },
    { label: 'Reports', icon: 'feedback', section: 'reports' },
    { label: 'Payments', icon: 'payments', section: 'payments' },
    { label: 'Announcements', icon: 'campaign', section: 'announcements' },
    { label: 'Analytics', icon: 'bar_chart', section: 'analytics' },
    
  ];

  studentMenuItems: any[] = [
    { label: 'Dashboard', icon: 'dashboard', section: 'dashboard' },
    { label: 'Menu', icon: 'restaurant_menu', section: 'menu' },
    { label: 'Cart', icon: 'shopping_cart', section: 'cart' },
    { label: 'Orders', icon: 'receipt_long', section: 'orders' },
    { label: 'Bills', icon: 'receipt_long', section: 'bills' },
    { label: 'Support', icon: 'support_agent', section: 'support' },
  ];

  adminMenuItems: any[] = [
    { label: 'Dashboard', icon: 'dashboard', section: 'dashboard' },
    { label: 'Managers', icon: 'badge', section: 'managers' },
    { label: 'Students', icon: 'people', section: 'students' },
    { label: 'Reports', icon: 'assessment', section: 'reports' },
    { label: 'Payments', icon: 'payments', section: 'payments' },
  ];

  generalMenuItems: any[] = [
    { label: 'Home', icon: 'home', route: '/' },
    { label: 'About', icon: 'info', route: '/about' },
    { label: 'Contact', icon: 'mail', route: '/contact' },
  ];

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private profileService: ProfileService,
  ) {}

  ngOnInit() {
    this.checkAuth();

    if (this.isLoggedIn) {
      this.loadNotifications();
      this.loadProfile();
    }

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.checkAuth();

      if (this.isLoggedIn) {
        this.loadNotifications();
        this.loadProfile();
      }
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
  openNotifications() {
    this.isSidebarOpen = false;

    this.router.navigate([this.getDashboardRoute()], {
      queryParams: { section: 'notifications' },
    });
  }

  openProfile() {
    this.isSidebarOpen = false;

    this.router.navigate([this.getDashboardRoute()], {
      queryParams: { section: 'profile' },
    });
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (response: any) => {
        this.notifications = response.data || [];

        this.unreadCount = this.notifications.filter((notification) => !notification.isRead).length;
      },
      error: (error: any) => {
        console.error('Failed to load notifications:', error);
      },
    });
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (response: any) => {
        this.profile = response.data;
      },
      error: (error: any) => {
        console.error('Failed to load profile:', error);
      },
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
    this.showNotifications = false;
  }

  markAsRead(notification: any) {
    if (notification.isRead) {
      return;
    }

    this.notificationService.markNotificationRead(notification._id).subscribe({
      next: () => {
        notification.isRead = true;

        this.unreadCount = this.notifications.filter((item) => !item.isRead).length;
      },
      error: (error: any) => {
        console.error('Failed to mark notification as read:', error);
      },
    });
  }
}
