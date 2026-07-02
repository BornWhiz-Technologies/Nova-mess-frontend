import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signupData = {
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  };

  emailError = '';
  mobileError = '';
  registerError = '';
  registerMessage = '';

  constructor(private arthinew: Auth, private router: Router) {}

  validateEmail(event: Event) {
    const input = event.target as HTMLInputElement;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (input.value === '') {
      this.emailError = '';
    } else if (!pattern.test(input.value)) {
      this.emailError = 'Please enter a valid email address (e.g. example@gmail.com).';
    } else {
      this.emailError = '';
    }
  }

  validateMobile(event: Event) {
    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value === '') {
      this.mobileError = '';
    } else if (input.value.length < 10) {
      this.mobileError = 'Please enter a valid 10-digit mobile number.';
    } else if (input.value.length > 10) {
      this.mobileError = 'Mobile number must contain exactly 10 digits.';
    } else {
      this.mobileError = '';
    }
  }

  submit() {
    this.registerError = '';
    this.registerMessage = '';

    if (
      !this.signupData.username.trim() ||
      !this.signupData.email.trim() ||
      !this.signupData.mobileNumber.trim() ||
      !this.signupData.password.trim() ||
      !this.signupData.confirmPassword.trim()
    ) {
      this.registerError = 'Please fill in all fields.';
      return;
    }

    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.registerError = 'Passwords do not match.';
      return;
    }

    if (this.emailError || this.mobileError) {
      this.registerError = 'Please fix the highlighted errors before submitting.';
      return;
    }

    this.arthinew.registers(this.signupData).subscribe({
      next: (response) => {
        this.registerMessage = response?.message || 'Account created successfully.';
        alert(this.registerMessage);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.registerError = error?.error?.message || 'Registration failed. Please try again.';
        console.error('Signup error:', error);
      }
    });
  }


}
