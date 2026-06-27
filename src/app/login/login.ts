import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  showPassword = false;

  loginData = {
    username: '',
    password: ''
  };

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {

    if (
      this.loginData.username.trim() === '' ||
      this.loginData.password.trim() === ''
    ) {
      alert('Please enter Username and Password');
      return;
    }

    alert('Login Successful');

    console.log(this.loginData);

    this.loginData = {
      username: '',
      password: ''
    };
  }

}