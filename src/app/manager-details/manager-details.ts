import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Manager } from '../services/manager';

@Component({
  selector: 'app-manager-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manager-details.html',
  styleUrl: './manager-details.css',
})
export class ManagerDetails {
  constructor(
    private managerService: Manager,
    private router: Router,
  ) {}

  managerData = {
    userId: '',
    fullName: '',
    employeeId: '',
    experience: 0,
    shift: '',
  };

  profilePicture!: File;
  employeeIdProof!: File;

  onProfilePictureChange(event: any) {
    if (event.target.files.length > 0) {
      this.profilePicture = event.target.files[0];
    }
  }

  onEmployeeIdProofChange(event: any) {
    if (event.target.files.length > 0) {
      this.employeeIdProof = event.target.files[0];
    }
  }

  limitExperience(event: any) {
    let value = event.target.value;

    value = value.replace(/[^0-9]/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2);
    }

    event.target.value = value;
    this.managerData.experience = value ? Number(value) : 0;
  }

  saveManager() {
    const userId = localStorage.getItem('userId');

    console.log('LocalStorage userId :', userId);

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

    console.log('===== FormData =====');

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    this.managerService.saveManagerDetails(formData).subscribe({
      next: (response) => {
        console.log('API Success :', response);

        alert(response.message);

        this.router.navigate(['/manager-dashboard']);
      },

      error: (error) => {
        console.error('API Error :', error);

        console.log('Backend Response :', error.error);

        alert(error.error.message);
      },
    });
  }
}
