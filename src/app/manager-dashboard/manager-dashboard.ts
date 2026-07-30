import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ManagerService } from '../services/manager';
import { SectionService } from '../services/section.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-dashboard.html',
  styleUrls: ['./manager-dashboard.css'],
})
export class ManagerDashboard implements OnInit {
  activeSection = 'dashboard';
  greeting = '';
  notificationCount = 0;
  manager: any = {};
  dashboard: any = { todayOrders: 0, pendingOrders: 0, completedOrders: 0, todayRevenue: 0 };

  // Menu
  menuTab = 'today';
  todaysMenu: any[] = [];
  weeklyMenu: any[] = [];
  showAddMenu = false;
  editingMenu: any = null;
  menuData = {
    foodName: '',
    category: '',
    mealType: '',
    description: '',
    price: 0,
    date: '',
    available: true,
  };
  mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Orders
  orderTab: 'pending' | 'preparing' | 'completed' | 'cancelled' = 'pending';
  orders: any[] = [];

  private ordersRequestId = 0;

  // Students
  students: any[] = [];
  filteredStudents: any[] = [];
  searchQuery = '';
  studentFilter = 'all';

  // Reports
  reportTab = 'complaints';
  reports: any[] = [];

  // Analytics
  analytics: any = { totalRevenue: 0, totalOrders: 0, mostOrderedFood: '', weeklyData: [] };

  // Notifications
  notifications: any[] = [];

  // Profile
  isEditingProfile = false;
  editProfile = { fullName: '', phone: '', shift: '' };

  constructor(
    private managerService: ManagerService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}
  ngOnInit() {
    this.setGreeting();

    this.route.queryParams.subscribe((params) => {
      const section = params['section'] || 'dashboard';

      console.log('SECTION CHANGED:', section);

      this.activeSection = section;

      this.loadSectionData(section);

      // force UI update
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    });

    this.loadManagerProfile();
  }
  setGreeting() {
    const hour = new Date().getHours();
    this.greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  }

  goToSection(section: string) {
    this.activeSection = section;

    this.router.navigate([], {
      queryParams: {
        section: section,
      },
      queryParamsHandling: 'merge',
    });
  }

  loadSectionData(section: string) {
    switch (section) {
      case 'dashboard':
        this.loadDashboardSummary();
        break;
      case 'menu':
        this.menuTab = 'today';
        this.loadTodaysMenu();
        this.loadWeeklyMenu();
        break;
      case 'orders':
        this.loadOrders();
        break;
      case 'students':
        this.loadStudents();
        break;
      case 'reports':
        this.loadReports();
        break;
      case 'analytics':
        this.loadAnalytics();
        break;
      case 'notifications':
        this.loadNotifications();
        break;
      case 'profile':
        this.loadProfile();
        break;
    }
  }

  // Profile
  loadManagerProfile() {
    this.managerService.getManagerProfile().subscribe({
      next: (res: any) => {
        this.manager = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  // Dashboard
  loadDashboardSummary() {
    this.managerService.getDashboardSummary().subscribe({
      next: (res: any) => {
        this.dashboard = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  // Menu
  loadTodaysMenu() {
    this.managerService.getTodaysMenu().subscribe({
      next: (res: any) => {
        console.log('TODAY RESPONSE:', res);

        this.todaysMenu = [...(res.data || [])];

        this.cdr.detectChanges();
      },
      error: (err: any) => console.error(err),
    });
  }

  loadWeeklyMenu() {
    this.managerService.getWeeklyMenu().subscribe({
      next: (res: any) => {
        console.log('WEEKLY RESPONSE:', res);

        this.weeklyMenu = [...(res.data || [])];

        this.cdr.detectChanges();
      },
      error: (err: any) => console.error(err),
    });
  }

  saveMenu() {
    if (this.editingMenu) {
      // UPDATE
      this.managerService.updateMenu(this.editingMenu._id, this.menuData).subscribe({
        next: () => {
          this.loadTodaysMenu();
          this.loadWeeklyMenu();

          setTimeout(() => {
            this.closeMenuForm();
            alert('Menu updated successfully');
          }, 300);
        },
        error: (err: any) => {
          console.error(err);
          alert('Failed to update menu');
        },
      });
    } else {
      // ADD
      this.managerService.addMenu(this.menuData).subscribe({
        next: () => {
          this.loadTodaysMenu();
          this.loadWeeklyMenu();
          setTimeout(() => {
            this.closeMenuForm();
            alert('Menu added successfully');
          }, 300);
        },
        error: (err: any) => {
          console.error(err);
          alert('Failed to add menu');
        },
      });
    }
  }

  editMenu(item: any) {
    this.editingMenu = item;
    this.menuData = {
      foodName: item.foodName,
      category: item.category,
      mealType: item.mealType,
      description: item.description,
      price: item.price,
      date: item.date,
      available: item.available,
    };
    this.showAddMenu = true;
  }

  deleteMenu(id: string) {
    if (confirm('Delete this menu?')) {
      this.managerService.deleteMenu(id).subscribe({
        next: () => {
          this.todaysMenu = this.todaysMenu.filter((item) => item._id !== id);
          this.weeklyMenu = this.weeklyMenu.filter((item) => item._id !== id);

          this.cdr.detectChanges();

          alert('Menu deleted successfully');
        },

        error: (err: any) => {
          console.error(err);
          alert('Delete failed');
        },
      });
    }
  }
  closeMenuForm() {
    this.showAddMenu = false;
    this.editingMenu = null;

    this.menuData = {
      foodName: '',
      category: '',
      mealType: '',
      description: '',
      price: 0,
      date: '',
      available: true,
    };

    this.cdr.detectChanges();
  }

  // Orders
  loadOrders() {
    const selectedTab = this.orderTab;
    const requestId = ++this.ordersRequestId;

    // Immediately clear old tab data
    this.orders = [];

    this.managerService.getOrdersByStatus(selectedTab).subscribe({
      next: (res: any) => {
        // Ignore old API response
        if (requestId !== this.ordersRequestId) {
          return;
        }

        // Make sure response belongs to currently selected tab
        if (this.orderTab !== selectedTab) {
          return;
        }

        this.orders = Array.isArray(res?.data) ? [...res.data] : [];

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        // Ignore old request errors
        if (requestId !== this.ordersRequestId) {
          return;
        }

        console.error('Orders API Error:', err);

        this.orders = [];

        this.cdr.detectChanges();
      },
    });
  }

  updateOrderStatus(id: string, status: string) {
    this.managerService.updateOrderStatus(id, status).subscribe({
      next: () => {
        // Remove the order immediately from current tab
        this.orders = this.orders.filter((order) => order._id !== id);

        this.cdr.detectChanges();

        // Refresh current tab from backend
        this.loadOrders();
      },

      error: (err: any) => {
        console.error('Update order status error:', err);
      },
    });
  }

  // Students
  loadStudents() {
    this.managerService.getAllStudents().subscribe({
      next: (res: any) => {
        this.students = res.data;
        this.filterStudents();
      },
      error: (err: any) => console.error(err),
    });
  }

  filterStudents() {
    let result = [...this.students];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.fullName?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q),
      );
    }
    if (this.studentFilter === 'active') result = result.filter((s) => s.isActive);
    if (this.studentFilter === 'inactive') result = result.filter((s) => !s.isActive);
    this.filteredStudents = result;
  }

  // Reports
  loadReports() {
    this.managerService.getReports().subscribe({
      next: (res: any) => {
        this.reports = res.data.filter((r: any) => r.type === this.reportTab);
      },
      error: (err: any) => console.error(err),
    });
  }

  markResolved(id: string) {
    this.managerService.updateReportStatus(id, 'resolved').subscribe({
      next: () => this.loadReports(),
      error: (err: any) => console.error(err),
    });
  }

  // Analytics
  loadAnalytics() {
    this.managerService.getAnalytics().subscribe({
      next: (res: any) => {
        this.analytics = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  // Notifications
  loadNotifications() {
    this.managerService.getNotifications().subscribe({
      next: (res: any) => {
        this.notifications = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  markNotifRead(id: string) {
    this.managerService.markNotificationRead(id).subscribe({
      next: () => {
        const n = this.notifications.find((x) => x._id === id);
        if (n) n.isRead = true;
      },
      error: (err: any) => console.error(err),
    });
  }

  // Profile
  loadProfile() {
    this.managerService.getManagerProfile().subscribe({
      next: (res: any) => {
        this.manager = res.data;
        this.editProfile = {
          fullName: this.manager.fullName,
          phone: this.manager.phone,
          shift: this.manager.shift,
        };
      },
      error: (err: any) => console.error(err),
    });
  }

  saveProfile() {
    this.managerService.updateManagerProfile(this.editProfile).subscribe({
      next: (res: any) => {
        this.manager = res.data;
        this.isEditingProfile = false;
        alert('Profile updated');
      },
      error: (err: any) => console.error(err),
    });
  }
}
