import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css'
})
export class ManagerDashboard {

  managerName = 'Manager';

  stats = [
    {
      icon: '👨‍🎓',
      title: 'Students',
      value: 560
    },
    {
      icon: '🍽️',
      title: 'Meals Today',
      value: 4
    },
    {
      icon: '📦',
      title: 'Inventory',
      value: 128
    },
    {
      icon: '💬',
      title: 'Complaints',
      value: 7
    }
  ];

  todaysMenu = [
    {
      meal: 'Breakfast',
      items: 'Idli, Sambar, Chutney'
    },
    {
      meal: 'Lunch',
      items: 'Rice, Sambar, Poriyal'
    },
    {
      meal: 'Snacks',
      items: 'Samosa & Tea'
    },
    {
      meal: 'Dinner',
      items: 'Chapati, Kurma'
    }
  ];

  recentActivities = [
    'Student Registration Completed',
    'Lunch Menu Updated',
    'Inventory Stock Added',
    'Complaint Resolved',
    'Attendance Updated'
  ];

}