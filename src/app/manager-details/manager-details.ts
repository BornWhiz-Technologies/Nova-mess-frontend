import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Manager } from '../services/manager';

@Component({
  selector: 'app-manager-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manager-details.html',
  styleUrl: './manager-details.css'
})
export class ManagerDetails {

  constructor(
    private managerService: Manager,
    private router: Router
  ) {}

  managerData = {
    userId: '',
    fullName: '',
    employeeId: '',
    experience: 0,
    shift: ''
  };

  // Store selected files
  profilePicture!: File;
  employeeIdProof!: File;

  // Profile Picture
  onProfilePictureChange(event: any) {
    if (event.target.files.length > 0) {
      this.profilePicture = event.target.files[0];
    }
  }

  // Employee ID Proof
  onEmployeeIdProofChange(event: any) {
    if (event.target.files.length > 0) {
      this.employeeIdProof = event.target.files[0];
    }
  }

  // Allow only 2 digits for Experience
  limitExperience(event: any) {

    let value = event.target.value;

    // Remove non-numeric characters
    value = value.replace(/[^0-9]/g, '');

    // Allow only first 2 digits
    if (value.length > 2) {
      value = value.slice(0, 2);
    }

    event.target.value = value;
    this.managerData.experience = value ? Number(value) : 0;
  }

  saveManager() {

    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('User ID not found. Please login again.');
      return;
    }

    this.managerData.userId = userId;

    const formData = new FormData();

    formData.append('userId', this.managerData.userId);
    formData.append('fullName', this.managerData.fullName);
    formData.append('employeeId', this.managerData.employeeId);
    formData.append('experience', this.managerData.experience.toString());
    formData.append('shift', this.managerData.shift);

    if (this.profilePicture) {
      formData.append('profilePicture', this.profilePicture);
    }

    if (this.employeeIdProof) {
      formData.append('employeeIdProof', this.employeeIdProof);
    }

    this.managerService.saveManagerDetails(formData).subscribe({

      next: (response) => {

        alert(response.message);

        console.log(response);

        // Redirect to Manager Dashboard
        this.router.navigate(['/manager-dashboard']);

      },

      error: (error) => {

        console.error(error);

        alert(error.error.message);

      }

    });

  }

}