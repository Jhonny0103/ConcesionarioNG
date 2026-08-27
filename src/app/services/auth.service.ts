import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Employe } from '../models/employe.model';
import { AuthLogin } from '../models/authlogin.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7129/api/Auth/login'; // Reemplaza por tu endpoint real

  getLogin(login: AuthLogin): Observable<Employe> {
    //console.log("Name: " + login.name + " Email: " + login.email);
    const params = new HttpParams()
      .set('name', login.name)
      .set('email', login.email);

    return this.http.get<Employe>(this.apiUrl, { params }).pipe(
      tap((employe) => {
        if (employe) {
          localStorage.setItem('user', JSON.stringify(employe));
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