import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
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
