import { Injectable, inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router"
import { Observable } from "rxjs"

import { AuthService } from '../../auth/services/auth.service'

@Injectable()
export class AuthGuard implements CanActivate {
  auth = inject(AuthService)
  router = inject(Router)

  constructor() { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAuthenticated()) {
      return true
    } else {
      this.auth.logout()
      this.router.navigate(['/auth' ], )
      return false
    }
  }
}
