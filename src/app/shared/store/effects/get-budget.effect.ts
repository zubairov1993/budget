import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'


import { SharedService } from '../../services/shared.service'

import { getBudgetAction, getBudgetSuccessAction, getBudgetFailureAction } from '../actions/get-budget.action'

@Injectable()
export class GetBudgetEffect {
  private actions$ = inject(Actions)
  sharedService = inject(SharedService)
  router = inject(Router)

  getBudget$ = createEffect(() => this.actions$.pipe(
    ofType(getBudgetAction),
    switchMap(() => this.sharedService.getBudget().pipe(
      map((response: any) => {
        return getBudgetSuccessAction({response})
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        return of(getBudgetFailureAction())
        // return of(loginFailureAction({ errors: errorResponse.error.error.errors }))
      })
    ))
  ))

  // redirectAfterSubmit$ = createEffect(() => this.actions$.pipe(
  //   ofType(loginSuccessAction),
  //   tap(() => this.router.navigate(['/']))
  // ), {dispatch: false})
}
