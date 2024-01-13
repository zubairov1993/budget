import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '../action-types'
import { CreateMonthActionI, CreateMonthSuccessActionI } from '../../interfaces'


export const createMonthAction = createAction(
  ActionTypes.CREATE_MONTH,
  props<CreateMonthActionI>()
)

export const createMonthSuccessAction = createAction(
  ActionTypes.CREATE_MONTH_SUCCESS,
  props<CreateMonthSuccessActionI>()
)

export const createMonthFailureAction = createAction(ActionTypes.CREATE_MONTH_FAILURE)
