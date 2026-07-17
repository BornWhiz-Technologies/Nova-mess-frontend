import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  isSidebarOpen = false;
  showAuthButtons = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateNavbar();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateNavbar());
  }

  updateNavbar() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const isStudentDashboard = this.router.url.includes('/student-dashboard');

    /* Student login செய்து dashboard-ல் இருந்தால் மட்டும் buttons hide */
    this.showAuthButtons = !(token && role === 'student' && isStudentDashboard);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    if (this.isSidebarOpen && !target.closest('.sidebar') && !target.closest('.menu-btn')) {
      this.closeSidebar();
    }
  }
}
