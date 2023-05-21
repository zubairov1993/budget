import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IUser, IFBResponse } from '../interfaces/auth.interface';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(user: IUser): Observable<IFBResponse> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`;
    return this.http.post<IFBResponse>(url, user).pipe(
      tap(response => {
        if (response) {
          const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
          localStorage.setItem('token', response.idToken);
          localStorage.setItem('token-exp', expDate.toString());
        } else {
          localStorage.clear();
        }
      })
    );
  }

  logout() {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    const storedExpDate = localStorage.getItem('token-exp');
    const expDate = storedExpDate ? new Date(storedExpDate) : null;

    if (expDate && (new Date() > expDate)) {
      this.logout();
      return false;
    }
    return !!localStorage.getItem('token');
  }

  get token(): string | null {
    return this.isAuthenticated() ? localStorage.getItem('token') : null;
  }
}

