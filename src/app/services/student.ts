import { Injectable, inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  placeOrder(data: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/orders', data, {
      headers: this.getHeaders(),
    });
  }
  private http = inject(HttpClient);

  getDashboard(): Observable<any> {
    return this.http.get('http://localhost:5000/api/student/dashboard', {
      headers: this.getHeaders(),
    });
  }

  getProfile(): Observable<any> {
    return this.http.get('http://localhost:5000/api/student/profile', {
      headers: this.getHeaders(),
    });
  }

  getOrders(): Observable<any> {
    return this.http.get('http://localhost:5000/api/student/orders', {
      headers: this.getHeaders(),
    });
  }

  getMenus(): Observable<any> {
    return this.http.get('http://localhost:5000/api/menu');
  }

  getTodayMenus(): Observable<any> {
    return this.http.get('http://localhost:5000/api/menu/today');
  }

  submitFeedback(data: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/support/feedback', data, {
      headers: this.getHeaders(),
    });
  }

  submitReport(data: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/support/report', data, {
      headers: this.getHeaders(),
    });
  }
  getCart() {
    const token = localStorage.getItem('token');

    return this.http.get('http://localhost:5000/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  addToCart(data: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/cart/add', data, {
      headers: this.getHeaders(),
    });
  }
  removeFromCart(foodName: string): Observable<any> {
    return this.http.delete(
      `http://localhost:5000/api/cart/remove/${encodeURIComponent(foodName)}`,
      {
        headers: this.getHeaders(),
      },
    );
  }
  confirmPayment(paymentData: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/payments', paymentData, {
      headers: this.getHeaders(),
    });
  }
  getStudentBills(): Observable<any> {
    return this.http.get('http://localhost:5000/api/student/bills', {
      headers: this.getHeaders(),
    });
  }
  getAnnouncements(): Observable<any> {
    return this.http.get('http://localhost:5000/api/announcements', {
      headers: this.getHeaders(),
    });
  }
  
}
