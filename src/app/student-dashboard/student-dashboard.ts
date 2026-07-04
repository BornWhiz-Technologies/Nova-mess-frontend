import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard {
  studentName = '';
  rollNumber = '';
  sidebarItems = [
    'Dashboard',
    "Today's Menu",
    'Meal Booking',
    'Attendance',
    'Payment History',
    'Feedback',
    'Profile',
    'Logout',
  ];
  quickActions = ['Book Meal', 'View Attendance', 'Pay Dues', 'Submit Feedback'];
}
