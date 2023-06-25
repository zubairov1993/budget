import { Action, createReducer, on } from '@ngrx/store'

import { createMonthFailureAction, createMonthSuccessAction, createMonthAction } from '../actions/create-month.action'

import { CreateBudgetStateI } from '../interafaces/create-budget.interface'

const initialState: CreateBudgetStateI = {
  isSubmitting: false,
  error: null,
}

const createMonthReducer = createReducer(
  initialState,
  on(createMonthAction, (state): CreateBudgetStateI => ({
    ...state,
    isSubmitting: true,
  })),
  on(createMonthSuccessAction, (state, action): CreateBudgetStateI => ({
    ...state,
    isSubmitting: false
  })),
  on(createMonthFailureAction, (state): CreateBudgetStateI => ({
    ...state,
    isSubmitting: false,
  }))
)

export function monthReducer(state: CreateBudgetStateI, action: Action) {
  return createMonthReducer(state, action)
}
