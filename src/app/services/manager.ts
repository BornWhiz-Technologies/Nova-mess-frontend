import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:5000/api/manager';

@Injectable({
  providedIn: 'root'
})
export class Manager {

  private http = inject(HttpClient);

  // Manager Details API
  saveManagerDetails(formData: FormData): Observable<any> {

    return this.http.post(`${API_BASE_URL}/create`, formData);

  }

}