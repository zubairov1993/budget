import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of, filter } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { SharedService } from '../../../../../shared/services/shared.service'
import { BudgetService } from '../../../../services/budget.service'

import { createDayAction, createDaySuccessAction, createDayFailureAction } from '../actions/create-day.action'
import { createItemAction } from '../actions/create-item.action';

@Injectable()
export class CreateDayEffect {
  private actions$ = inject(Actions)
  sharedService = inject(SharedService)
  budgetService = inject(BudgetService)
  router = inject(Router)

  createDay$ = createEffect(() => this.actions$.pipe(
    ofType(createDayAction),
    switchMap(({ yearName, monthName, dayObj, itemObj }) => this.budgetService.createDay(yearName, monthName, dayObj).pipe(
      filter((response: any) => response !== null),
      map((response: { name: string }) => {
        return createDaySuccessAction({ yearName, monthName, dayName: response.name, itemObj })
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        return of(createDayFailureAction())
      })
    ))
  ))

  createitemAfterDay$ = createEffect(() => this.actions$.pipe(
    ofType(createDaySuccessAction),
    map(({ yearName, monthName, dayName, itemObj }) => {
      return createItemAction({ yearName, monthName, dayName, itemObj });
    })
  ))
}
