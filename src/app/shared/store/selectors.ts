import { createFeatureSelector, createSelector } from "@ngrx/store"

import { AppStateI } from '../../shared/interfaces/app-state.interface'
import { BudgetStateI } from '../interfaces/budget.interface'

export const budgetFeatureSelector = createFeatureSelector<AppStateI, BudgetStateI>('budget')
export const isLoadingSelector = createSelector(budgetFeatureSelector, (budgetStateI: BudgetStateI) => budgetStateI.isLoading)
export const errorSelector = createSelector(budgetFeatureSelector, (budgetStateI: BudgetStateI) => budgetStateI.error)
export const budgetSelector = createSelector(budgetFeatureSelector, (budgetStateI: BudgetStateI) => budgetStateI.data)
