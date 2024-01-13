import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'

import { BudgetService } from '../../../budget/services/budget.service'

import { deleteItem, deleteItemSuccessAction, deleteItemFailureAction } from '../actions/delete-item.action'

@Injectable()
export class DeleteItemEffect {
  private readonly actions$ = inject(Actions)
  private readonly budgetService = inject(BudgetService)

  createItem$ = createEffect(() => this.actions$.pipe(
    ofType(deleteItem),
    switchMap(({ yearName, year, monthName, month, dayName, day, itemId }) => this.budgetService.deleteItem(yearName, monthName, dayName, itemId).pipe(
      map((response: any) => {
        return deleteItemSuccessAction({ yearName, year, monthName, month, dayName, day, itemId })
      }),
      catchError((errorResponse: HttpErrorResponse) => of(deleteItemFailureAction()))
    ))
  ))
}
