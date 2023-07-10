import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"
import { Injectable, inject } from '@angular/core'
import { Router } from "@angular/router"
import { Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"

import { AuthService } from '../../auth/services/auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  router = inject(Router)
  authService = inject(AuthService)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.authService.isAuthenticated()) {
      req = req.clone({
        setParams: {
          auth: this.authService.token!
        }
      })
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('ERrrRReor: ', error)
        if(error.status === 401) {
          this.authService.logout()
          this.router.navigate(['/auth'], { queryParams: { authFailed: true } })
        }
        return throwError(error)
      })
    )
  }

}
