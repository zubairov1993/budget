import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { BudgetService } from '../../../budget/services/budget.service'
import { createDayAction, createMonthAction, createMonthFailureAction, createMonthSuccessAction } from '../actions'
import { SharedService } from '../../services'


@Injectable()
export class CreateMonthEffect {
  private readonly actions$ = inject(Actions)
  sharedService = inject(SharedService)
  private readonly budgetService = inject(BudgetService)
  private readonly = inject(Router)

  createMonth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createMonthAction),
      switchMap(({ yearName, year, monthsObj, month, day, isoDate, itemObj }) => this.budgetService.createMonth(yearName, monthsObj).pipe(
        map((response: { name: string }) => {
          return createMonthSuccessAction({ yearName, year, monthName: response.name, month, day, isoDate, itemObj })
        }),
        catchError((errorResponse: HttpErrorResponse) => of(createMonthFailureAction()))
      ))
    )
  })

  createDayAfterMonth$ = createEffect(() => this.actions$.pipe(
    ofType(createMonthSuccessAction),
    map(({ yearName, year, monthName, month, day, isoDate, itemObj }) => {
      const dayObj = {
        id: null as any,
        day: day,
        date: isoDate,
        totalPriceDay: null,
        items: []
      }
      return createDayAction({ yearName, year, monthName, month, dayObj, isoDate, itemObj });
    })
  ))
}
