import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  showPassword = false;
  loginError = '';

  loginData = {
    username: '',
    password: '',
  };

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.loginError = '';

    if (this.loginData.username.trim() === '' || this.loginData.password.trim() === '') {
      this.loginError = 'Please enter Username and Password';
      return;
    }

    this.auth.login(this.loginData).subscribe({
      next: (response: any) => {
        const payload = response?.data || response;

        const token = payload?.token;
        const role = payload?.role?.toLowerCase();
        const userId = payload?.id;

        if (!token) {
          this.loginError = 'Login failed. Invalid server response.';
          return;
        }

        /* Token மற்றும் role browser-ல் save ஆகும் */
        localStorage.setItem('token', token);

        if (userId) {
          localStorage.setItem('userId', userId.toString());
        }

        if (role) {
          localStorage.setItem('role', role);
        }

        /* Role based dashboard navigation */
        switch (role) {
          case 'admin':
            this.router.navigate(['/admin-dashboard']);
            break;

          case 'manager':
            this.router.navigate(['/manager-dashboard']);
            break;

          case 'student':
            this.router.navigate(['/student-dashboard']);
            break;

          default:
            localStorage.removeItem('token');
            localStorage.removeItem('role');

            this.loginError = 'Login failed. Unauthorized role.';
            console.error('Login Error: Unknown role', payload);
        }
      },

      error: (error: any) => {
        this.loginError = error?.error?.message || 'Login failed. Please try again.';

        console.error('Login Error:', error);
      },
    });
  }
}
