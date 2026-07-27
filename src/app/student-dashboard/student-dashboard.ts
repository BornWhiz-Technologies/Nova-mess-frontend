import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionService } from '../services/section.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css'],
})
export class StudentDashboard implements OnInit {
  activeSection = 'dashboard';

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
    { foodName: 'Veg Meals', date: 'Today', status: 'Delivered' },
    { foodName: 'Lemon Rice', date: 'Yesterday', status: 'Delivered' },
    { foodName: 'Chicken Biryani', date: '2 Days Ago', status: 'Cancelled' },
  ];

  menuItems = [
    { mealType: 'Breakfast', items: 'Idly, Sambar, Chutney', time: '7:30 AM - 9:00 AM' },
    { mealType: 'Lunch', items: 'Rice, Sambar, Kootu, Rasam', time: '12:00 PM - 2:00 PM' },
    { mealType: 'Dinner', items: 'Chapati, Paneer Curry, Rice', time: '7:00 PM - 9:00 PM' },
  ];

  orderHistory = [
    { foodName: 'Veg Meals', date: '2026-07-20', amount: 70, status: 'Delivered' },
    { foodName: 'Lemon Rice', date: '2026-07-19', amount: 50, status: 'Delivered' },
    { foodName: 'Chicken Biryani', date: '2026-07-18', amount: 120, status: 'Cancelled' },
    { foodName: 'Meals', date: '2026-07-17', amount: 70, status: 'Delivered' },
  ];

  constructor(private sectionService: SectionService) {}

  ngOnInit() {
    this.sectionService.activeSection$.subscribe((section) => {
      this.activeSection = section;
    });
  }
}
