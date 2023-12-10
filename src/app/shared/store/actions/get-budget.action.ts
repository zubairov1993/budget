import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '../action-types'
import { YearDataI } from '../../interfaces'


export const getBudgetAction = createAction(ActionTypes.GET_BUDGET)

export const getBudgetSuccessAction = createAction(
  ActionTypes.GET_BUDGET_SUCCESS,
  props<{ response: YearDataI[] }>()
)

export const getBudgetFailureAction = createAction(ActionTypes.GET_BUDGET_FAILURE)
