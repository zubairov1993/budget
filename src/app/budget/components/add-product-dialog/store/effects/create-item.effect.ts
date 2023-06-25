import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of, filter } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { SharedService } from '../../../../../shared/services/shared.service'
import { BudgetService } from '../../../../services/budget.service'

import { createItemAction, createItemSuccessAction, createItemFailureAction } from '../actions/create-item.action'

@Injectable()
export class CreateItemEffect {
  private actions$ = inject(Actions)
  sharedService = inject(SharedService)
  budgetService = inject(BudgetService)
  router = inject(Router)

  createItem$ = createEffect(() => this.actions$.pipe(
    ofType(createItemAction),
    switchMap(({ itemObj, yearName, monthName, dayName }) => this.budgetService.createItem(yearName, monthName, dayName, itemObj).pipe(
      filter((response: any) => response !== null),
      map((response: any) => {
        return createItemSuccessAction({ response })
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        return of(createItemFailureAction())
      })
    ))
  ))
}
