import { createAction, props } from '@ngrx/store'

import { CreateYearActionI, CreateYearSuccessActionI } from '../../interfaces'
import { ActionTypes } from '../action-types'


export const createYearAction = createAction(
  ActionTypes.CREATE_YEAR,
  props<CreateYearActionI>()
)

export const createYearSuccessAction = createAction(
  ActionTypes.CREATE_YEAR_SUCCESS,
  props<CreateYearSuccessActionI>()
)

export const createYearFailureAction = createAction(ActionTypes.CREATE_YEAR_FAILURE)
