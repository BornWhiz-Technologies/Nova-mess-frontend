import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-studentdetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './studentdetails.html',
  styleUrl: './studentdetails.css',
})
export class Studentdetails {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  student = {
    name: '',
    regno: '',
    department: '',
    year: '',
    section: '',
    profilePicture: null as File | null
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

  console.log("Validate Form Called");

  this.validateName();
  this.validateRegNo();


    if (this.nameError || this.regError) {
      this.saveError = 'Please fix the highlighted errors.';
      return;
    }

    this.saveError = '';

    const token = localStorage.getItem('token');

    if (!token) {
      this.saveError = 'Please login again.';
      return;
    }

    const body = {
      fullName: this.student.name,
      registerNumber: this.student.regno,
      department: this.student.department,
      year: this.student.year,
      section: this.student.section
    };

    this.http.put(
      'http://localhost:5000/api/auth/studentprofile',
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response: any) => {

        alert(response.message || 'Student Details Saved Successfully.');
        this.router.navigate(['/student-dashboard']);

      },

      error: (error) => {

        this.saveError =
          error?.error?.message || 'Failed to save student details.';
          alert(this.saveError);

      }

    });

  }

}