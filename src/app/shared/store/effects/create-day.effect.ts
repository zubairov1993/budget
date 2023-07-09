import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of, filter } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { SharedService } from '../../services/shared.service'
import { BudgetService } from '../../../budget/services/budget.service'

import { createDayAction, createDaySuccessAction, createDayFailureAction } from '../actions/create-day.action'
import { createItemAction } from '../actions/create-item.action'

@Injectable()
export class CreateDayEffect {
  private actions$ = inject(Actions)
  sharedService = inject(SharedService)
  budgetService = inject(BudgetService)
  router = inject(Router)

  createDay$ = createEffect(() => this.actions$.pipe(
    ofType(createDayAction),
    switchMap(({ yearName, year, monthName, month, dayObj, isoDate, itemObj }) => this.budgetService.createDay(yearName, monthName, dayObj).pipe(
      filter((response: any) => response !== null),
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
