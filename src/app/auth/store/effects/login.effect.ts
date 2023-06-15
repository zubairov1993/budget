import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loginAction, loginSuccessAction, loginFailureAction } from '../actions/login.action';
import { AuthService } from '../../services/auth.service';
import { switchMap, map, of } from 'rxjs';
import { FBResponseI } from '../../interfaces/auth.interface';
import { catchError } from 'rxjs/operators';

@Injectable()
export class LoginEffect {
  private actions$ = inject(Actions)
  private authService = inject(AuthService)

  login$ = createEffect(() => this.actions$.pipe(
    ofType(loginAction),
    switchMap(({request}) => this.authService.login(request).pipe(
      map((response: FBResponseI) => {
        return loginSuccessAction({response})
      }),
      catchError(() => {
        return of(loginFailureAction())
      })
    ))
  ))
}
