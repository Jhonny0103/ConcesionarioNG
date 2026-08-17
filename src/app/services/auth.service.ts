import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Customer } from '../models/customer.model';
import { AuthLogin } from '../models/authlogin.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7129/api/Auth/login'; // Reemplaza por tu endpoint real

  getLogin(login: AuthLogin): Observable<Customer> {
    const params = new HttpParams()
      .set('firstName', login.firstName)
      .set('email', login.email);

    return this.http.get<Customer>(this.apiUrl, { params }).pipe(
      tap((customer) => {
        if (customer) {
          localStorage.setItem('user', JSON.stringify(customer));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}