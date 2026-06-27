import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  emailError = "";
  mobileError = "";

  validateEmail(event: Event) {

    const input = event.target as HTMLInputElement;

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (input.value === "") {
      this.emailError = "";
    }
    else if (!pattern.test(input.value)) {
      this.emailError = "Please enter a valid email address (e.g. example@gmail.com).";
    }
    else {
      this.emailError = "";
    }
  }

  validateMobile(event: Event) {

    const input = event.target as HTMLInputElement;

    // Numbers only
    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value === "") {
      this.mobileError = "";
    }
    else if (input.value.length < 10) {
      this.mobileError = "Please enter a valid 10-digit mobile number.";
    }
    else if (input.value.length > 10) {
      this.mobileError = "Mobile number must contain exactly 10 digits.";
    }
    else {
      this.mobileError = "";
    }
  }

}