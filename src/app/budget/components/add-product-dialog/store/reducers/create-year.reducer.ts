import { Action, createReducer, on } from '@ngrx/store'

import { createYearAction, createYearFailureAction, createYearSuccessAction } from '../actions/create-year.action'

import { CreateBudgetStateI } from '../interafaces/create-budget.interface'

const initialState: CreateBudgetStateI = {
  isSubmitting: false,
  error: null,
}

const createYearReducer = createReducer(
  initialState,
  on(createYearAction, (state): CreateBudgetStateI => ({
    ...state,
    isSubmitting: true,
  })),
  on(createYearSuccessAction, (state, action): CreateBudgetStateI => ({
    ...state,
    isSubmitting: false
  })),
  on(createYearFailureAction, (state): CreateBudgetStateI => ({
    ...state,
    isSubmitting: false,
  }))
)

export function yearReducer(state: CreateBudgetStateI, action: Action) {
  return createYearReducer(state, action)
}
