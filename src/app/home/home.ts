import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      switch (role) {
        case 'manager':
          this.router.navigate(['/manager-dashboard'], { replaceUrl: true });
          break;
        case 'student':
          this.router.navigate(['/student-dashboard'], { replaceUrl: true });
          break;
        case 'admin':
          this.router.navigate(['/admin-dashboard'], { replaceUrl: true });
          break;
      }
    }
  }
}
