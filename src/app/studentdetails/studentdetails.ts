import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-studentdetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './studentdetails.html',
  styleUrl: './studentdetails.css',
})
export class Studentdetails {
  student = {
    name: '',
    regno: ''
  };

  nameError = '';
  regError = '';
  saveError = '';

  validateName() {
    const namePattern = /^[A-Za-z ]+$/;
    if (!this.student.name.trim() || !namePattern.test(this.student.name)) {
      this.nameError = 'Please enter a valid name using letters only.';
    } else {
      this.nameError = '';
    }
  }

  validateRegNo() {
    const regPattern = /^[0-9]+$/;
    if (!this.student.regno.trim() || !regPattern.test(this.student.regno)) {
      this.regError = 'Please enter a valid registration number using digits only.';
    } else {
      this.regError = '';
    }
  }

  validateForm() {
    this.validateName();
    this.validateRegNo();

    if (this.nameError || this.regError) {
      this.saveError = 'Please fix the highlighted errors.';
      return;
    }

    this.saveError = '';
    alert('Profile Saved Successfully ✅');
  }
}
