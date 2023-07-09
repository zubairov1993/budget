import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '../action-types'

import { CreateDayActionI, CreateDaySuccessActionI } from '../../interfaces/day-action.interface'

export const createDayAction = createAction(
  ActionTypes.CREATE_DAY,
  props<CreateDayActionI>()
)

export const createDaySuccessAction = createAction(
  ActionTypes.CREATE_DAY_SUCCESS,
  props<CreateDaySuccessActionI>()
)

export const createDayFailureAction = createAction(ActionTypes.CREATE_DAY_FAILURE)
