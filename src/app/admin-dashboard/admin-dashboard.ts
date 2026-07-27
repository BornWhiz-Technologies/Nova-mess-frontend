import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionService } from '../services/section.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
  activeSection = 'dashboard';

  adminName = 'Admin';

  stats = {
    totalManagers: 5,
    totalStudents: 120,
    activeOrders: 34,
    revenue: 15200,
  };

  managers = [
    { name: 'Ravi Kumar', employeeId: 'MGR001', shift: 'Morning', status: 'Active' },
    { name: 'Suresh Babu', employeeId: 'MGR002', shift: 'Evening', status: 'Active' },
    { name: 'Karthik R', employeeId: 'MGR003', shift: 'Night', status: 'Inactive' },
  ];

  students = [
    { name: 'Guna Priya', regNo: '21CS001', department: 'CSE', year: 'III Year' },
    { name: 'Arun S', regNo: '22IT015', department: 'IT', year: 'II Year' },
    { name: 'Priya M', regNo: '21AI008', department: 'AIDS', year: 'III Year' },
    { name: 'Kiran V', regNo: '23CS022', department: 'CSE', year: 'I Year' },
  ];

  reports = [
    { title: 'Food Quality Issue', type: 'complaint', date: '2026-07-22', status: 'Pending' },
    { title: 'Great Mess Service', type: 'feedback', date: '2026-07-21', status: 'Resolved' },
    { title: 'Late Lunch Delivery', type: 'complaint', date: '2026-07-20', status: 'Pending' },
  ];

  constructor(private sectionService: SectionService) {}

  ngOnInit() {
    this.sectionService.activeSection$.subscribe((section) => {
      this.activeSection = section;
    });
  }
}
