import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../services/student';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../services/notification';
import { ProfileService } from '../services/profile';
@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css'],
})
export class StudentDashboard implements OnInit {
  activeSection: string = 'dashboard';
  greeting: string = '';

  supportOption: string = '';

  feedbackRating: number = 0;
  feedbackComment: string = '';

  reportType: string = '';
  reportDescription: string = '';

  studentName = 'Guna Priya';
  department = 'Information Technology';
  year = 'II Year';
  section = 'A';
  profile: any = null;

  todayMenu: any = null;

  todaySpecial = {
    foodName: 'Chicken Biryani',
    description: 'Today Special Lunch',
    image: 'assets/food.png',
  };

  announcements: any[] = [];

  menuItems: any[] = [];
  orderHistory: any[] = [];

  selectedFood: any = null;
  showOrderBox = false;
  quantity = 1;

  isLoading = false;

  cartItems: any[] = [];
  cartTotal = 0;

  showPaymentPopup = false;

  selectedPaymentMethod: string = '';
  selectedPaymentOption: string = '';

  paymentPopupType: string = '';

  showBillPopup = false;
  billOrder: any = null;
  billPayment: any = null;
  bills: any[] = [];

  notifications: any[] = [];
  profileData: any = null;

  constructor(
    private studentService: StudentService,
    private notificationService: NotificationService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.setGreeting();

    this.route.queryParams.subscribe((params) => {
      const section = params['section'] || 'dashboard';

      console.log('Route Section:', section);

      this.activeSection = section;

      this.loadSectionData(section);

      this.cdr.detectChanges();
    });
  }

  // ===============================
  // GREETING
  // ===============================

  setGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 17) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }
  // ===============================
  // SECTION NAVIGATION
  // ===============================

  loadSectionData(section: string) {
    switch (section) {
      case 'dashboard':
        this.loadDashboardData();
        this.loadAnnouncements();
        break;

      case 'menu':
        this.loadTodayMenu();
        break;

      case 'cart':
        this.loadCart();
        break;

      case 'orders':
        this.loadOrders();
        break;

      case 'bills':
        this.loadBills();
        break;

      case 'payment':
        this.loadCart();
        break;

      case 'notifications':
        this.loadNotifications();
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
  // ANNOUNCEMENTS
  // ===============================

  loadAnnouncements() {
    this.studentService.getAnnouncements().subscribe({
      next: (res: any) => {
        console.log('ANNOUNCEMENTS RESPONSE:', res);

        this.announcements = Array.isArray(res?.data) ? res.data : [];

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Unable to load announcements:', err);
        this.announcements = [];
        this.cdr.detectChanges();
      },
    });
  }
  loadNotifications() {
    this.isLoading = true;

    this.notificationService.getNotifications().subscribe({
      next: (res: any) => {
        console.log('NOTIFICATIONS RESPONSE:', res);

        this.notifications = Array.isArray(res?.data) ? res.data : [];

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Unable to load notifications:', err);

        this.notifications = [];
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

    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        console.log('PROFILE RESPONSE:', res);

        if (res?.success) {
          this.profileData = res.data;

          const user = res?.data?.user;
          const profile = res?.data?.profile;

          if (user) {
            this.studentName = user.fullName || user.username || this.studentName;
          }

          if (profile) {
            this.department = profile.department || '-';
            this.year = profile.year || '-';
            this.section = profile.section || '-';
          }
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Unable to load profile:', err);

        this.profileData = null;
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
  // BILLS
  // ===============================

  loadBills() {
    this.isLoading = true;

    this.studentService.getStudentBills().subscribe({
      next: (res: any) => {
        console.log('BILLS RESPONSE:', res);

        if (res?.success) {
          this.bills = res.data || [];
        } else {
          this.bills = [];
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Unable to load student bills:', err);

        this.bills = [];

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
  // ===============================
  // CART FUNCTIONS
  // ===============================

  addToCart(food: any) {
    const cartData = {
      foodName: food.foodName,
      price: Number(food.price),
      quantity: 1,
    };

    console.log('Sending Cart Data:', cartData);

    this.studentService.addToCart(cartData).subscribe({
      next: (res: any) => {
        console.log('CART API RESPONSE:', res);

        alert(res.message || 'Item added to cart successfully');

        this.loadCart();

        this.goToSection('cart');
      },

      error: (err: any) => {
        console.error('CART API ERROR:', err);

        alert(err.error?.message || 'Unable to add item to cart');
      },
    });
  }

  loadCart() {
    this.studentService.getCart().subscribe({
      next: (res: any) => {
        console.log('CART RESPONSE:', res);

        this.cartItems = res?.data?.items || [];

        this.calculateCartTotal();

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('CART LOAD ERROR:', err);

        this.cartItems = [];
        this.cartTotal = 0;
      },
    });
  }

  increaseQuantity(item: any) {
    item.quantity++;

    this.calculateCartTotal();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeFromCart(item.foodName);

      return;
    }

    this.calculateCartTotal();
  }

  removeFromCart(foodName: string) {
    this.studentService.removeFromCart(foodName).subscribe({
      next: (res: any) => {
        console.log('REMOVE CART RESPONSE:', res);

        if (res.success) {
          this.cartItems = res.data?.items || [];
          this.cartTotal = res.data?.totalAmount || 0;

          this.cdr.detectChanges();

          alert('Item removed from cart');
        } else {
          alert(res.message || 'Unable to remove item');
        }
      },

      error: (err: any) => {
        console.error('REMOVE CART ERROR:', err);

        alert(err.error?.message || 'Unable to remove item from cart');
      },
    });
  }

  calculateCartTotal() {
    this.cartTotal = this.cartItems.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0,
    );
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.selectedPaymentOption = '';

    if (method === 'UPI') {
      this.paymentPopupType = 'UPI';
      this.showPaymentPopup = true;
    }

    if (method === 'Card') {
      this.paymentPopupType = 'Card';
      this.showPaymentPopup = true;
    }

    if (method === 'Cash') {
      this.paymentPopupType = 'Cash';
      this.selectedPaymentOption = 'Cash';
      this.showPaymentPopup = true;
    }
  }
  selectPaymentOption(option: string) {
    this.selectedPaymentOption = option;

    console.log('Selected Payment Option:', option);
  }
  confirmPayment() {
    if (!this.selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // =========================
    // STEP 1: PREPARE ALL CART ITEMS
    // =========================

    const orderItems = this.cartItems.map((item: any) => ({
      foodName: item.foodName,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    const orderData = {
      studentName: this.studentName,
      items: orderItems,
      totalPrice: this.cartTotal,
    };

    console.log('CREATING ORDER:', orderData);

    // =========================
    // STEP 2: CREATE ONE ORDER
    // =========================

    this.studentService.placeOrder(orderData).subscribe({
      next: (orderRes: any) => {
        console.log('ORDER RESPONSE:', orderRes);

        if (!orderRes.success) {
          alert(orderRes.message || 'Unable to create order');
          return;
        }

        const orderId = orderRes.data._id;

        console.log('ORDER ID:', orderId);

        // =========================
        // STEP 3: CREATE PAYMENT
        // =========================

        const paymentData = {
          orderId: orderId,
          amount: this.cartTotal,
          paymentMethod: this.selectedPaymentMethod,
          paymentOption: this.selectedPaymentOption,
          paymentStatus: this.selectedPaymentMethod === 'Cash' ? 'Pending' : 'Paid',
        };

        console.log('CREATING PAYMENT:', paymentData);

        this.studentService.confirmPayment(paymentData).subscribe({
          next: (paymentRes: any) => {
            console.log('PAYMENT RESPONSE:', paymentRes);

            if (paymentRes.success) {
              alert(
                this.selectedPaymentMethod === 'Cash'
                  ? 'Cash order confirmed successfully'
                  : 'Payment successful',
              );
              this.billOrder = orderRes.data;
              this.billPayment = paymentRes.data;
              this.showBillPopup = true;

              // Remove all paid items from database cart
              this.cartItems.forEach((item: any) => {
                this.studentService.removeFromCart(item.foodName).subscribe({
                  next: (removeRes: any) => {
                    console.log('CART ITEM REMOVED:', item.foodName, removeRes);
                  },

                  error: (err: any) => {
                    console.error('FAILED TO REMOVE CART ITEM:', item.foodName, err);
                  },
                });
              });

              // =========================
              // CLEAR PAYMENT + CART
              // =========================

              this.selectedPaymentMethod = '';
              this.selectedPaymentOption = '';
              this.showPaymentPopup = false;
              this.paymentPopupType = '';

              this.cartItems = [];
              this.cartTotal = 0;

              // =========================
              // REFRESH ORDERS
              // =========================

              this.loadOrders();
              this.loadBills();
            } else {
              alert(paymentRes.message || 'Payment failed');
            }
          },

          error: (err: any) => {
            console.error('PAYMENT ERROR:', err);

            alert(err.error?.message || 'Unable to process payment. Please try again.');
          },
        });
      },

      error: (err: any) => {
        console.error('ORDER ERROR:', err);

        alert(err.error?.message || 'Unable to create order. Please try again.');
      },
    });
  }
  closePaymentPopup() {
    this.showPaymentPopup = false;
    this.selectedPaymentOption = '';
  }
  goToSection(section: string) {
    this.router.navigate([], {
      queryParams: { section },
      queryParamsHandling: 'merge',
    });
  }
  downloadBill() {
    if (!this.billOrder) {
      alert('No bill available');
      return;
    }

    const billId = this.billPayment?._id || this.billOrder?._id || 'bill';

    const billDate = this.billOrder?.createdAt
      ? new Date(this.billOrder.createdAt).toLocaleString()
      : new Date().toLocaleString();

    const paymentMode = this.billPayment?.paymentMethod || '-';

    const items = this.billOrder?.items || [];

    let itemsHtml = '';

    items.forEach((item: any) => {
      itemsHtml += `
      <tr>
        <td>${item.foodName}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
        <td>₹${item.price * item.quantity}</td>
      </tr>
    `;
    });

    const billHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Mess Nova Bill</title>
      <link rel="stylesheet" href="bill.css">
    </head>

    <body>

      <div class="bill">

        <h1>MESS NOVA</h1>

        <p class="paid">PAID</p>

        <div class="info">
          <strong>Student:</strong> ${this.studentName}<br>
          <strong>Bill ID:</strong> ${billId}<br>
          <strong>Date & Time:</strong> ${billDate}<br>
          <strong>Payment Mode:</strong> ${paymentMode}
        </div>

        <h3>Ordered Items</h3>

        <table>
          <thead>
            <tr>
              <th>Food</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total">
          Total Paid:
          ₹${this.billOrder?.totalPrice || this.billPayment?.amount || 0}
        </div>

      </div>

    </body>
    </html>
  `;

    const blob = new Blob([billHtml], {
      type: 'text/html',
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = `MessNova-Bill-${billId}.html`;

    link.click();

    window.URL.revokeObjectURL(url);
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
