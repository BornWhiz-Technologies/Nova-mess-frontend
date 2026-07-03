import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:5000/api/auth';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private http = inject(HttpClient);

  // Register API
  registers(data: {
    username: string;
    email: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
    role: string;
  }): Observable<any> {

    return this.http.post(`${API_BASE_URL}/register`, data);

  }

  // Login API
  login(data: {
    username: string;
    password: string;
  }): Observable<any> {

    return this.http.post(`${API_BASE_URL}/login`, data);

  }

}

