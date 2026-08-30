import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:5000/api/manager';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  saveManagerDetails(formData: FormData): Observable<any> {
    return this.http.post(`${API_BASE_URL}/create`, formData, {
      headers: this.getHeaders(),
    });
  }

  getManagerProfile(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/profile`, {
      headers: this.getHeaders(),
    });
  }

  updateManagerProfile(data: any): Observable<any> {
    return this.http.put(`${API_BASE_URL}/profile`, data, {
      headers: this.getHeaders(),
    });
  }

  getDashboardSummary(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/dashboard`, {
      headers: this.getHeaders(),
    });
  }

  getTodaysMenu(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/menu/today`, {
      headers: this.getHeaders(),
    });
  }

  getWeeklyMenu(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/menu/weekly`, {
      headers: this.getHeaders(),
    });
  }

  addMenu(data: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/menu', data, {
      headers: this.getHeaders(),
    });
  }

  updateMenu(id: string, data: any): Observable<any> {
    return this.http.put(`http://localhost:5000/api/menu/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteMenu(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/api/menu/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getRecentOrders(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/orders/recent`, {
      headers: this.getHeaders(),
    });
  }

  getAllOrders(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/orders`, {
      headers: this.getHeaders(),
    });
  }

  getOrdersByStatus(status: string) {
    return this.http.get(`http://localhost:5000/api/orders?status=${status}`, {
      headers: this.getHeaders(),
    });
  }

  updateOrderStatus(id: string, status: string) {
    return this.http.put(
      `http://localhost:5000/api/orders/${id}/status`,
      { status },
      {
        headers: this.getHeaders(),
      },
    );
  }

  getAllStudents(): Observable<any> {
    return this.http.get('http://localhost:5000/api/manager/students', {
      headers: this.getHeaders(),
    });
  }

  getReports(): Observable<any> {
    return this.http.get('http://localhost:5000/api/manager/reports', {
      headers: this.getHeaders(),
    });
  }

  updateReportStatus(id: string, status: string): Observable<any> {
    return this.http.put(
      `${API_BASE_URL}/reports/${id}`,
      { status },
      {
        headers: this.getHeaders(),
      },
    );
  }
  // ===============================
  // PAYMENTS
  // ===============================

  // Get all payments - Manager
  getAllPayments(): Observable<any> {
    return this.http.get('http://localhost:5000/api/payments/all', {
      headers: this.getHeaders(),
    });
  }

  // Get payment by order
  getPaymentByOrder(orderId: string): Observable<any> {
    return this.http.get(`http://localhost:5000/api/payments/${orderId}`, {
      headers: this.getHeaders(),
    });
  }

  // Update payment status
  updatePaymentStatus(id: string, status: string): Observable<any> {
    return this.http.put(
      `http://localhost:5000/api/payments/${id}/status`,
      { status },
      {
        headers: this.getHeaders(),
      },
    );
  }
  // ===============================
  // ANNOUNCEMENTS
  // ===============================

  getAnnouncements(): Observable<any> {
    return this.http.get('http://localhost:5000/api/announcements', {
      headers: this.getHeaders(),
    });
  }

  createAnnouncement(data: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/announcements', data, {
      headers: this.getHeaders(),
    });
  }

  updateAnnouncement(id: string, data: any): Observable<any> {
    return this.http.put(`http://localhost:5000/api/announcements/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteAnnouncement(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/api/announcements/${id}`, {
      headers: this.getHeaders(),
    });
  }
  // ===============================
  // SUPPORT - FEEDBACK & REPORTS
  // ===============================

  getSupportRequests(): Observable<any> {
    return this.http.get('http://localhost:5000/api/support', {
      headers: this.getHeaders(),
    });
  }

  updateSupportStatus(id: string, status: string): Observable<any> {
    return this.http.put(
      `http://localhost:5000/api/support/${id}/status`,
      { status },
      {
        headers: this.getHeaders(),
      },
    );
  }

  getAnalytics(): Observable<any> {
    return this.http.get('http://localhost:5000/api/manager/analytics', {
      headers: this.getHeaders(),
    });
  }

  getNotifications(): Observable<any> {
    return this.http.get('http://localhost:5000/api/manager/notifications', {
      headers: this.getHeaders(),
    });
  }

  markNotificationRead(id: string): Observable<any> {
    return this.http.put(
      `http://localhost:5000/api/manager/notifications/${id}`,
      {},
      {
        headers: this.getHeaders(),
      },
    );
  }
}
