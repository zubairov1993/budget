import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'

import { getBudgetAction, getBudgetSuccessAction, getBudgetFailureAction } from '../actions/get-budget.action'

import { SharedService } from '../../services'

@Injectable()
export class GetBudgetEffect {
  private actions$ = inject(Actions)
  sharedService = inject(SharedService)

  getBudget$ = createEffect(() => this.actions$.pipe(
    ofType(getBudgetAction),
    switchMap(() => this.sharedService.getBudget().pipe(
      map((response: any) => {
        return getBudgetSuccessAction({ response })
      }),
      catchError((errorResponse: HttpErrorResponse) => of(getBudgetFailureAction()))
    ))
  ))
}
