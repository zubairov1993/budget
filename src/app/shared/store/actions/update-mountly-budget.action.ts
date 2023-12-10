import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '../action-types'

export const updateMountlyBudgetAction = createAction(
  ActionTypes.UPDATE_MOUNTLY_BUDGET,
  props<{ year: number, monthlyBudget: number, bool: boolean }>()
)

export const updateMountlyBudgetSuccessAction = createAction(
  ActionTypes.UPDATE_MOUNTLY_BUDGET_SUCCESS,
  props<{ year: number, monthlyBudget: number, bool: boolean }>()
)

export const updateMountlyBudgetFailureAction = createAction(ActionTypes.UPDATE_MOUNTLY_BUDGET_FAILURE)
