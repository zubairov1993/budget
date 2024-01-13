import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'

import { updateMountlyBudgetAction, updateMountlyBudgetFailureAction, updateMountlyBudgetSuccessAction } from '../actions'
import { SharedService } from '../../services'

@Injectable()
export class UpdateMountlyBudgetEffect {
  private readonly actions$ = inject(Actions)
  sharedService = inject(SharedService)

  updateMountly$ = createEffect(() => this.actions$.pipe(
    ofType(updateMountlyBudgetAction),
    switchMap(({ year, monthlyBudget, bool }) => this.sharedService.updateMonthlyBudget(monthlyBudget, bool).pipe(
      map((response: { monthlyBudget: number }) => {
        this.sharedService.monthlyBudget$.next(response.monthlyBudget)
        return updateMountlyBudgetSuccessAction({ year, monthlyBudget: response.monthlyBudget, bool: true})
      }),
      catchError((errorResponse: HttpErrorResponse) => of(updateMountlyBudgetFailureAction()))
    ))
  ))
}
