import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard {
  constructor(private router: Router) {}

  studentName = 'Guna Priya';
  department = 'Information Technology';
  year = 'II Year';
  section = 'A';

  todayMenu = {
    foodName: 'Veg Meals',
    price: 70,
    available: 98,
  };

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

  recentOrders = [
    {
      foodName: 'Veg Meals',
      date: 'Today',
      status: 'Delivered',
    },

    {
      foodName: 'Lemon Rice',
      date: 'Yesterday',
      status: 'Delivered',
    },

    {
      foodName: 'Chicken Biryani',
      date: '2 Days Ago',
      status: 'Cancelled',
    },
  ];

  goHome() {
    this.router.navigate(['/student-dashboard']);
  }

  goMenu() {
    this.router.navigate(['/student-menu']);
     alert('Menu Page Coming Soon');
  }

  goOrders() {
    this.router.navigate(['/student-orders']);
     alert('Orders Page Coming Soon');
  }

  goProfile() {
    this.router.navigate(['/student-profile']);
     alert('Profile Page Coming Soon');
  }
}
