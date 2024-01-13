import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'

import { BudgetService } from '../../../budget/services/budget.service'
import { createDayAction, createDayFailureAction, createDaySuccessAction, createItemAction } from '../actions'


@Injectable()
export class CreateDayEffect {
  private readonly actions$ = inject(Actions)
  private readonly budgetService = inject(BudgetService)

  createDay$ = createEffect(() => this.actions$.pipe(
    ofType(createDayAction),
    switchMap(({ yearName, year, monthName, month, dayObj, isoDate, itemObj }) => this.budgetService.createDay(yearName, monthName, dayObj).pipe(
      map((response: { name: string }) => {
        return createDaySuccessAction({ yearName, year, monthName, month, dayName: response.name, day: dayObj.day, isoDate, itemObj })
      }),
      catchError((errorResponse: HttpErrorResponse) => of(createDayFailureAction()))
    ))
  ))

  createitemAfterDay$ = createEffect(() => this.actions$.pipe(
    ofType(createDaySuccessAction),
    map(({ yearName, year, monthName, month, dayName, day, itemObj }) => {
      return createItemAction({ yearName, year, monthName, month, dayName, day, itemObj })
    })
  ))
}
