import { BudgetStateI } from '../interfaces/budget.interface';
import { Action, createReducer, on } from '@ngrx/store';
import { getBudgetAction, getBudgetSuccessAction, getBudgetFailureAction } from './actions/get-budget.action';
const initialState: BudgetStateI = {
  isLoading: false,
  error: null,
  data: null,
}

const budgetReducer = createReducer(
  initialState,
  on(getBudgetAction, (state): BudgetStateI => ({
    ...state,
    isLoading: true,
  })),
  on(getBudgetSuccessAction, (state, action): BudgetStateI => ({
    ...state,
    isLoading: false,
    data: action.response
  })),
  on(getBudgetFailureAction, (state): BudgetStateI => ({
    ...state,
    isLoading: false,
  }))
)

export function reducers(state: BudgetStateI, action: Action) {
  return budgetReducer(state, action)
}
