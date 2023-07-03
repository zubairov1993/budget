import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { SharedService } from '../../../../../shared/services/shared.service'
import { BudgetService } from '../../../../services/budget.service'

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
        console.log('response: ', response);
        return createYearSuccessAction({ yearName: response.name, month, day, isoDate, itemObj })
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        console.log('errorResponse: ', errorResponse);
        return of(createYearFailureAction())
      })
    ))
  ))

  createMonthAfterYear$ = createEffect(() => this.actions$.pipe(
    ofType(createYearSuccessAction),
    map(({ yearName, month, day, isoDate, itemObj }) => {
      const monthsObj = {
        month: month,
        totalPriceMonth: null,
        days: []
      }
      console.log('Dispatching createMonthAction');
      return createMonthAction({ yearName, monthsObj, day, isoDate, itemObj });
    })
  ))

  // createYearSuccess$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(createYearSuccessAction),
  //     switchMap(({ yearName, month, day, isoDate, itemObj }) => this.budgetService.createMonth(yearName, {
  //       month: month,
  //       totalPriceMonth: null,
  //       days: []
  //     }).pipe(
  //       map((response: { name: string }) => {
  //         return createMonthAction({ yearName: yearName, monthName: response.name, day, isoDate, itemObj })
  //       }),
  //       catchError((errorResponse: HttpErrorResponse) => {
  //         return of(createYearFailureAction())
  //       })
  //     ))
  //   )
  // );
}
