import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, BehaviorSubject } from 'rxjs'
import { tap } from 'rxjs/operators'

import { environment } from "src/environments/environment"

import { UserI, FBResponseI } from '../interfaces/auth.interface'

@Injectable({
  providedIn: "root"
})
export class AuthService {
  http = inject(HttpClient)
  setCurrency$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  login(user: UserI): Observable<FBResponseI> {
    const url = `${environment.firebaseConfig.signInWithPasswordPath}${environment.firebaseConfig.apiKey}`
    return this.http.post<FBResponseI>(url, user).pipe(
      tap(response => {
        if (response) {
          const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
          localStorage.setItem('uidBudget', response.localId)
          localStorage.setItem('tokenBudget', response.idToken)
          localStorage.setItem('tokenBudget-exp', expDate.toString())

          this.setCurrency$.next(true)
        } else {
          localStorage.clear()
        }
      })
    )
  }

  get localId() {
    return localStorage.getItem('uidBudget') ? localStorage.getItem('uidBudget') : null
  }

  logout(): void {
    localStorage.clear()
  }

  isAuthenticated(): boolean {
    const storedExpDate = localStorage.getItem('tokenBudget-exp')
    const expDate = storedExpDate ? new Date(storedExpDate) : null
    if (expDate && (new Date() > expDate)) {
      this.logout()
      return false
    }
    return !!localStorage.getItem('tokenBudget')
  }

  get token(): string | null {
    return this.isAuthenticated() ? localStorage.getItem('tokenBudget') : null
  }
}

