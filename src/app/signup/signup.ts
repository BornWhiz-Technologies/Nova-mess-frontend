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

  usernameError = '';
  emailError = '';
  mobileError = '';
  passwordError = '';
  confirmPasswordError = '';
  registerError = '';
  registerMessage = '';

  constructor(
    private arthinew: Auth,
    private router: Router
  ) {}

  validateUsername(event: Event) {
    const input = event.target as HTMLInputElement;
    const originalValue = input.value;

    const filteredValue = originalValue.replace(/[^A-Za-z]/g, '');

    if (originalValue !== filteredValue) {
      this.usernameError = 'Only alphabets are allowed.';
    } else {
      this.usernameError = '';
    }

    input.value = filteredValue;
    this.signupData.username = filteredValue;
  }

  validateEmail(event: Event) {
    const input = event.target as HTMLInputElement;

    let value = input.value;

    value = value.replace(/[^a-zA-Z0-9@._]/g, '');
    this.signupData.email = value;
    input.value = value;

    const gmailPattern = /^[a-zA-Z0-9._]+@gmail\.com$/;

    if (value === '') {
      this.emailError = '';
    } else if (!gmailPattern.test(value)) {
      this.emailError =
        'Please enter a valid Gmail address (example@gmail.com).';
    } else {
      this.emailError = '';
    }
  }

  validateMobile(event: Event) {
    const input = event.target as HTMLInputElement;
    const originalValue = input.value;

    const filteredValue = originalValue.replace(/[^0-9]/g, '').slice(0, 10);

    if (originalValue !== filteredValue) {
      this.mobileError = 'Only numbers are allowed.';
    } else if (filteredValue === '') {
      this.mobileError = '';
    } else if (filteredValue.length !== 10) {
      this.mobileError = 'Please enter a valid 10-digit mobile number.';
    } else {
      this.mobileError = '';
    }

    input.value = filteredValue;
    this.signupData.mobileNumber = filteredValue;
  }

  validatePassword(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.signupData.password = value;

    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>_\-\\/[\]=+;']).{8,}$/;

    if (value === '') {
      this.passwordError = '';
    } else if (!passwordPattern.test(value)) {
      this.passwordError =
        'Password must be at least 8 characters and include 1 capital, 1 small, 1 number, and 1 special character.';
    } else {
      this.passwordError = '';
    }

    this.validateConfirmPassword();
  }

  validateConfirmPassword() {
    if (this.signupData.confirmPassword === '') {
      this.confirmPasswordError = '';
    } else if (
      this.signupData.password !== this.signupData.confirmPassword
    ) {
      this.confirmPasswordError = 'Passwords do not match.';
    } else {
      this.confirmPasswordError = '';
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

    const gmailPattern = /^[a-zA-Z0-9._]+@gmail\.com$/;

    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>_\-\\/[\]=+;']).{8,}$/;

    if (!/^[A-Za-z]+$/.test(this.signupData.username)) {
      this.usernameError = 'Only alphabets are allowed.';
      this.registerError =
        'Please fix the highlighted errors before submitting.';
      return;
    }

    if (!gmailPattern.test(this.signupData.email)) {
      this.emailError =
        'Please enter a valid Gmail address (example@gmail.com).';
      this.registerError =
        'Please fix the highlighted errors before submitting.';
      return;
    }

    if (!/^[0-9]{10}$/.test(this.signupData.mobileNumber)) {
      this.mobileError =
        'Please enter a valid 10-digit mobile number.';
      this.registerError =
        'Please fix the highlighted errors before submitting.';
      return;
    }

    if (!passwordPattern.test(this.signupData.password)) {
      this.passwordError =
        'Password must be at least 8 characters and include 1 capital, 1 small, 1 number, and 1 special character.';
      this.registerError =
        'Please fix the highlighted errors before submitting.';
      return;
    }

    if (
      this.signupData.password !==
      this.signupData.confirmPassword
    ) {
      this.confirmPasswordError = 'Passwords do not match.';
      this.registerError = 'Passwords do not match.';
      return;
    }

    if (
      this.usernameError ||
      this.emailError ||
      this.mobileError ||
      this.passwordError ||
      this.confirmPasswordError
    ) {
      this.registerError =
        'Please fix the highlighted errors before submitting.';
      return;
    }

    this.arthinew.registers(this.signupData).subscribe({
      next: (response) => {
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }
        this.registerMessage = response?.message || 'Account created successfully.';

        const data = response.data;

        // Save user details
        localStorage.setItem('userId', data.id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        alert(this.registerMessage);

        if (data.role === 'student') {

          this.router.navigate(['/studentdetails']);

        } else if (data.role === 'manager') {

          this.router.navigate(['/manager-details']);

        }

      },

      error: (error: any) => {

        this.registerError =
          error?.error?.message ||
          'Registration failed. Please try again.';

        alert(this.registerError);

      }

    });

  }

}