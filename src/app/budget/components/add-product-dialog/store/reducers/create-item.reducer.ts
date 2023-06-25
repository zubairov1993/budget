import { Action, createReducer, on } from '@ngrx/store'

import { createItemAction, createItemSuccessAction, createItemFailureAction } from '../actions/create-item.action'

import { CreateBudgetStateI } from '../interafaces/create-budget.interface'

const initialState: CreateBudgetStateI = {
  isSubmitting: false,
  error: null,
}

const createItemReducer = createReducer(
  initialState,
  on(createItemAction, (state): CreateBudgetStateI => ({
    ...state,
    isSubmitting: true,
  })),
  on(createItemSuccessAction, (state, action): CreateBudgetStateI => ({
    ...state,
    isSubmitting: false
  })),
  on(createItemFailureAction, (state): CreateBudgetStateI => ({
    ...state,
    isSubmitting: false,
  }))
)

export function itemReducer(state: CreateBudgetStateI, action: Action) {
  return createItemReducer(state, action)
}
