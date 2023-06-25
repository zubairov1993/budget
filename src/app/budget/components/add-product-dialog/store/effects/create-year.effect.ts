import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of, filter } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { SharedService } from '../../../../../shared/services/shared.service'
import { BudgetService } from '../../../../services/budget.service'

import { createYearAction, createYearSuccessAction, createYearFailureAction } from '../actions/create-year.action'

@Injectable()
export class CreateYearEffect {
  private actions$ = inject(Actions)
  sharedService = inject(SharedService)
  budgetService = inject(BudgetService)
  router = inject(Router)

  createYear$ = createEffect(() => this.actions$.pipe(
    ofType(createYearAction),
    switchMap(({ yearObj, month, day, isoDate, itemObj }) => this.budgetService.createYear(yearObj).pipe(
      map((response: { name: string }) => {
        return createYearSuccessAction({ yearName: response.name, month, day, isoDate, itemObj })
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        return of(createYearFailureAction())
      })
    ))
  ))

  createYearSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createYearSuccessAction),
      switchMap(({ yearName, month, day, isoDate, itemObj }) => this.budgetService.createMonth(yearName, {
        month: month,
        totalPriceMonth: null,
        days: []
      }).pipe(
        map((response: { name: string }) => {
          return createYearSuccessAction({ yearName: response.name, month, day, isoDate, itemObj })
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          return of(createYearFailureAction())
        })
      ))
    )
  );
}
