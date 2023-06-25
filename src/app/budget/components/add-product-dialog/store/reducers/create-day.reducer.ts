import { Action, createReducer, on } from '@ngrx/store'

import { createDayAction, createDaySuccessAction, createDayFailureAction } from '../actions/create-day.action'

import { CreateBudgetStateI } from '../interafaces/create-budget.interface'

const initialState: CreateBudgetStateI = {
  isSubmitting: false,
  error: null,
}

const createDayReducer = createReducer(
  initialState,
  on(createDayAction, (state): CreateBudgetStateI => ({
    ...state,
    isSubmitting: true,
  })),
  on(createDaySuccessAction, (state, action): CreateBudgetStateI => ({
    ...state,
    isSubmitting: false
  })),
  on(createDayFailureAction, (state): CreateBudgetStateI => ({
    ...state,
    isSubmitting: false,
  }))
)

export function dayReducer(state: CreateBudgetStateI, action: Action) {
  return createDayReducer(state, action)
}
