import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { SharedService } from '../../../../../shared/services/shared.service'
import { BudgetService } from '../../../../services/budget.service'

import { createMonthAction, createMonthSuccessAction, createMonthFailureAction } from '../actions/create-month.action'

@Injectable()
export class CreateMonthEffect {
  private actions$ = inject(Actions)
  sharedService = inject(SharedService)
  budgetService = inject(BudgetService)
  router = inject(Router)

  createYear$ = createEffect(() => this.actions$.pipe(
    ofType(createMonthAction),
    switchMap(({ yearName, monthsObj, day, isoDate, itemObj }) => this.budgetService.createMonth(yearName, monthsObj).pipe(
      map((response: { name: string }) => {
        return createMonthSuccessAction({ yearName, monthName: response.name, day, isoDate, itemObj })
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        return of(createMonthFailureAction())
      })
    ))
  ))
}
