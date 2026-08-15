import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../services/student';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css'],
})
export class StudentDashboard implements OnInit {
  activeSection: string = 'dashboard';

  supportOption: string = '';

  feedbackRating: number = 0;
  feedbackComment: string = '';

  reportType: string = '';
  reportDescription: string = '';

  studentName = 'Guna Priya';
  department = 'Information Technology';
  year = 'II Year';
  section = 'A';

  todayMenu: any = null;

  todaySpecial = {
    foodName: 'Chicken Biryani',
    description: 'Today Special Lunch',
    image: 'assets/food.png',
  };

  announcements = [
    'Tomorrow Breakfast starts at 7:00 AM.',
    'Friday Special Meals Available.',
    'Please carry your Student ID Card.',
  ];

  menuItems: any[] = [];
  orderHistory: any[] = [];

  selectedFood: any = null;
  showOrderBox = false;
  quantity = 1;

  isLoading = false;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const section = params['section'] || 'dashboard';

      console.log('Route Section:', section);

      this.activeSection = section;

      this.loadSectionData(section);

      this.cdr.detectChanges();
    });
  }

  // ===============================
  // SECTION NAVIGATION
  // ===============================

  loadSectionData(section: string) {
    switch (section) {
      case 'dashboard':
        this.loadDashboardData();
        break;

      case 'menu':
        this.loadTodayMenu();
        break;

      case 'orders':
        this.loadOrders();
        break;

      case 'profile':
        this.loadProfile();
        break;

      case 'support':
        this.supportOption = '';
        break;

      default:
        this.activeSection = 'dashboard';
        this.loadDashboardData();
        break;
    }
  }

  // ===============================
  // DASHBOARD
  // ===============================

  loadDashboardData() {
    this.isLoading = true;

    this.studentService.getDashboard().subscribe({
      next: (res: any) => {
        console.log('DASHBOARD RESPONSE:', res);

        const dashboard = res?.data;
        const profile = dashboard?.profile;

        if (profile) {
          this.studentName = profile.fullName || profile.username || this.studentName;

          this.department = profile.department || '-';
          this.year = profile.year || '-';
          this.section = profile.section || '-';
        }

        if (dashboard?.todayMenu) {
          this.todayMenu = dashboard.todayMenu;
        } else {
          this.todayMenu = null;
        }

        this.orderHistory = dashboard?.recentOrders || [];

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Unable to load student dashboard:', err);

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ===============================
  // PROFILE
  // ===============================

  loadProfile() {
    this.isLoading = true;

    this.studentService.getDashboard().subscribe({
      next: (res: any) => {
        console.log('PROFILE RESPONSE:', res);

        const profile = res?.data?.profile;

        if (profile) {
          this.studentName = profile.fullName || profile.username || this.studentName;

          this.department = profile.department || '-';
          this.year = profile.year || '-';
          this.section = profile.section || '-';
        }

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Unable to load profile:', err);

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ===============================
  // MENU
  // ===============================

  loadTodayMenu() {
    this.isLoading = true;

    this.studentService.getTodayMenus().subscribe({
      next: (res: any) => {
        console.log('MENU RESPONSE:', res);

        const menus = Array.isArray(res?.data) ? res.data : [];

        this.menuItems = menus.filter((menu: any) => menu.available !== false);

        this.todayMenu = this.menuItems[0] || null;

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Unable to load menu:', err);

        this.menuItems = [];
        this.todayMenu = null;

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ===============================
  // ORDERS
  // ===============================

  loadOrders() {
    this.isLoading = true;

    this.studentService.getOrders().subscribe({
      next: (res: any) => {
        console.log('ORDERS RESPONSE:', res);

        this.orderHistory = res?.data || [];

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Unable to load student orders:', err);

        this.orderHistory = [];

        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // ===============================
  // ORDER NOW
  // ===============================

  orderNow(menu: any) {
    this.selectedFood = menu;
    this.quantity = 1;
    this.showOrderBox = true;

    console.log('Ordering Food:', this.selectedFood);
  }

  // ===============================
  // CONFIRM ORDER
  // ===============================

  confirmOrder() {
    if (!this.selectedFood || this.quantity < 1) {
      return;
    }

    const order = {
      menuId: this.selectedFood._id,
      studentName: this.studentName,
      foodName: this.selectedFood.foodName,
      quantity: this.quantity,
      totalPrice: this.selectedFood.price * this.quantity,
    };

    console.log('Sending Order:', order);

    this.studentService.placeOrder(order).subscribe({
      next: (res: any) => {
        console.log('ORDER RESPONSE:', res);

        if (res.success) {
          this.showOrderBox = false;
          this.selectedFood = null;
          this.quantity = 1;

          alert('Order placed successfully');

          // Fresh order data
          this.loadOrders();
          this.activeSection = 'orders';

          this.orderHistory.unshift(res.data);

          this.cdr.detectChanges();
        } else {
          alert('Order failed');
        }
      },

      error: (err) => {
        console.error('Order Error:', err);

        alert(err.error?.message || 'Unable to place order');
      },
    });
  }

  // ===============================
  // CANCEL ORDER POPUP
  // ===============================

  cancelOrder() {
    this.showOrderBox = false;
    this.selectedFood = null;
    this.quantity = 1;
  }

  openFeedback() {
    this.supportOption = 'feedback';
  }

  openReport() {
    this.supportOption = 'report';
  }

  backToSupport() {
    this.supportOption = '';
  }

  submitFeedback() {
    if (!this.feedbackRating || !this.feedbackComment.trim()) {
      alert('Please give a rating and feedback.');
      return;
    }

    const feedbackData = {
      rating: this.feedbackRating,
      comment: this.feedbackComment.trim(),
    };

    console.log('Sending Feedback:', feedbackData);

    this.studentService.submitFeedback(feedbackData).subscribe({
      next: (res: any) => {
        console.log('FEEDBACK RESPONSE:', res);

        if (res.success) {
          // Clear the form
          this.feedbackRating = 0;
          this.feedbackComment = '';

          // Return to Support main page
          this.supportOption = '';

          this.cdr.detectChanges();

          alert('Thank you! Your feedback has been submitted successfully.');
        } else {
          alert(res.message || 'Feedback submission failed.');
        }
      },

      error: (err: any) => {
        console.error('Feedback Error:', err);

        alert(err.error?.message || 'Unable to submit feedback. Please try again.');
      },
    });
  }

  submitReport() {
    if (!this.reportType || !this.reportDescription.trim()) {
      alert('Please select an issue type and describe the issue.');
      return;
    }

    const reportData = {
      issueType: this.reportType,
      description: this.reportDescription.trim(),
    };

    console.log('Sending Report:', reportData);

    this.studentService.submitReport(reportData).subscribe({
      next: (res: any) => {
        console.log('REPORT RESPONSE:', res);

        if (res.success) {
          // Clear the report form
          this.reportType = '';
          this.reportDescription = '';

          // Go back to Support main page
          this.supportOption = '';

          this.cdr.detectChanges();

          alert('Your report has been submitted successfully.');
        } else {
          alert(res.message || 'Report submission failed.');
        }
      },

      error: (err: any) => {
        console.error('Report Error:', err);

        alert(err.error?.message || 'Unable to submit report. Please try again.');
      },
    });
  }

  getFoodImage(foodName: string): string {
    if (!foodName) return 'foods/default.jpg';

    const name = foodName.toLowerCase();

    if (name.includes('idli')) return 'foods/idly.jpg';
    if (name.includes('dosa')) return 'foods/dosa.jpg';
    if (name.includes('pongal')) return 'foods/pongal.jpg';
    if (name.includes('poori')) return 'foods/poori.jpg';
    if (name.includes('biriyani')) return 'foods/biriyani.jpg';
    if (name.includes('friedrice')) return 'foods/friedrice.jpg';
    if (name.includes('chapati')) return 'foods/chapati.jpg';
    if (name.includes('pulao')) return 'foods/pulao.jpg';

    return 'foods/default.jpg';
  }
}
