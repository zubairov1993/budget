import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { SharedService } from '../../services/shared.service'
import { BudgetService } from '../../../budget/services/budget.service'

import { createYearAction, createYearSuccessAction, createYearFailureAction } from '../actions/create-year.action'
import { createMonthAction } from '../actions/create-month.action'

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
        return createYearSuccessAction({ yearName: response.name, year: yearObj.year, month, day, isoDate, itemObj })
      }),
      catchError((errorResponse: HttpErrorResponse) => of(createYearFailureAction()))
    ))
  ))

  createMonthAfterYear$ = createEffect(() => this.actions$.pipe(
    ofType(createYearSuccessAction),
    map(({ yearName, year, month, day, isoDate, itemObj }) => {
      const monthsObj = {
        month: month,
        totalPriceMonth: null,
        days: []
      }
      return createMonthAction({ yearName, year, monthsObj, month, day, isoDate, itemObj })
    })
  ))
}
