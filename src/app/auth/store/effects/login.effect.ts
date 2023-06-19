import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { loginAction, loginSuccessAction, loginFailureAction } from '../actions/login.action'

import { AuthService } from '../../services/auth.service'

import { FBResponseI } from '../../interfaces/auth.interface'

@Injectable()
export class LoginEffect {
  private actions$ = inject(Actions)
  private authService = inject(AuthService)
  router = inject(Router)

  login$ = createEffect(() => this.actions$.pipe(
    ofType(loginAction),
    switchMap(({request}) => this.authService.login(request).pipe(
      map((response: FBResponseI) => {
        return loginSuccessAction({response})
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        console.log('errorResponse', errorResponse.error.error.errors);
        return of(loginFailureAction({ errors: errorResponse.error.error.errors }))
      })
    ))
  ))

  redirectAfterSubmit$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccessAction),
    tap(() => this.router.navigate(['/']))
  ), {dispatch: false})
}
