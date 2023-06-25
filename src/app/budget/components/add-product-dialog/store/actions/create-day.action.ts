import { createAction, props } from '@ngrx/store'
import { ActionTypes } from '../action-types'
import { DayDataI, ItemDataI } from '../../../../../shared/interfaces/budget.interface'

export const createDayAction = createAction(
  ActionTypes.CREATE_DAY,
  props<{ yearName: string, monthName: string, dayObj: DayDataI, itemObj: ItemDataI }>()
)

export const createDaySuccessAction = createAction(
  ActionTypes.CREATE_DAY_SUCCESS,
  props<{ yearName: string, monthName: string, dayName: string, itemObj: ItemDataI }>()
)

export const createDayFailureAction = createAction(ActionTypes.CREATE_DAY_FAILURE)
