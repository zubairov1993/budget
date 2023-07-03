import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { SharedService } from '../../../../../shared/services/shared.service'
import { BudgetService } from '../../../../services/budget.service'

import { createMonthAction, createMonthSuccessAction, createMonthFailureAction } from '../actions/create-month.action'
import { createDayAction } from '../actions/create-day.action';

@Injectable()
export class CreateMonthEffect {
  private actions$ = inject(Actions)
  sharedService = inject(SharedService)
  budgetService = inject(BudgetService)
  router = inject(Router)

  createMonth$ = createEffect(() => {
    console.log('createMonth$ effect is running');
    return this.actions$.pipe(
      ofType(createMonthAction),
      switchMap(({ yearName, monthsObj, day, isoDate, itemObj }) => this.budgetService.createMonth(yearName, monthsObj).pipe(
        map((response: { name: string }) => {
          console.log('response: ', response);
          return createMonthSuccessAction({ yearName, monthName: response.name, day, isoDate, itemObj })
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          console.log('errorResponse: ', errorResponse);

          return of(createMonthFailureAction())
        })
      ))
    )
  })

  createDayAfterMonth$ = createEffect(() => this.actions$.pipe(
    ofType(createMonthSuccessAction),
    map(({ yearName, monthName, day, isoDate, itemObj }) => {
      const dayObj = {
        day: day,
        date: isoDate,
        totalPriceDay: null,
        items: []
      }
      return createDayAction({ yearName, monthName, dayObj, itemObj });
    })
  ))
}
