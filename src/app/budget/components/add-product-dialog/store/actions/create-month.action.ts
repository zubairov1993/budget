import { createAction, props } from '@ngrx/store'
import { ActionTypes } from '../action-types'
import { MonthDataI, ItemDataI } from '../../../../../shared/interfaces/budget.interface'

export const createMonthAction = createAction(
  ActionTypes.CREATE_MONTH,
  props<{ yearName: string, monthsObj: MonthDataI, day: number, isoDate: string, itemObj: ItemDataI }>()
)

export const createMonthSuccessAction = createAction(
  ActionTypes.CREATE_MONTH_SUCCESS,
  props<{ yearName: string, monthName: string, day: number, isoDate: string, itemObj: ItemDataI }>()
)

export const createMonthFailureAction = createAction(ActionTypes.CREATE_MONTH_FAILURE)
