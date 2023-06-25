import { createAction, props } from '@ngrx/store'
import { ActionTypes } from '../action-types'

import { YearDataI, ItemDataI } from '../../../../../shared/interfaces/budget.interface';

export const createYearAction = createAction(
  ActionTypes.CREATE_YEAR,
  props<{ yearObj: YearDataI, month: number, day: number, isoDate: string, itemObj: ItemDataI }>()
)

export const createYearSuccessAction = createAction(
  ActionTypes.CREATE_YEAR_SUCCESS,
  props<{ yearName: string, month: number, day: number, isoDate: string, itemObj: ItemDataI }>()
)

export const createYearFailureAction = createAction(ActionTypes.CREATE_YEAR_FAILURE)
