import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { UserI, FBResponseI } from '../interfaces/auth.interface'
import { environment } from "src/environments/environment"

@Injectable({
  providedIn: "root"
})
export class AuthService {
  http = inject(HttpClient)

  constructor() {}

  login(user: UserI): Observable<FBResponseI> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`;
    return this.http.post<FBResponseI>(url, user).pipe(
      tap(response => {
        if (response) {
          const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
          localStorage.setItem('token', response.idToken);
          localStorage.setItem('token-exp', expDate.toString());
        } else {
          localStorage.clear();
        }
      })
    )
  }

  logout(): void {
    localStorage.clear()
  }

  isAuthenticated(): boolean {
    const storedExpDate = localStorage.getItem('token-exp')
    const expDate = storedExpDate ? new Date(storedExpDate) : null

    if (expDate && (new Date() > expDate)) {
      this.logout()
      return false
    }
    return !!localStorage.getItem('token')
  }

  get token(): string | null {
    return this.isAuthenticated() ? localStorage.getItem('token') : null
  }
}

