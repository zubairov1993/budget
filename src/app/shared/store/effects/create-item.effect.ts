import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'

import { BudgetService } from '../../../budget/services/budget.service'

import { createItemAction, createItemSuccessAction, createItemFailureAction } from '../actions/create-item.action'

@Injectable()
export class CreateItemEffect {
  private actions$ = inject(Actions)
  budgetService = inject(BudgetService)

  createItem$ = createEffect(() => this.actions$.pipe(
    ofType(createItemAction),
    switchMap(({ yearName, year, monthName, month, dayName, day, itemObj }) => this.budgetService.createItem(yearName, monthName, dayName, itemObj).pipe(
      map((response: { name: string }) => {
        return createItemSuccessAction({ year, month, day, itemObj })
      }),
      catchError((errorResponse: HttpErrorResponse) => of(createItemFailureAction()))
    ))
  ))
}
