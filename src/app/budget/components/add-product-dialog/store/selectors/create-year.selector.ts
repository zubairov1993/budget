import { createFeatureSelector, createSelector } from "@ngrx/store"

import { CreateBudgetStateI } from '../interafaces/create-budget.interface'
import { AppStateI } from '../../../../../shared/interfaces/app-state.interface'

export const createYearFeatureSelector = createFeatureSelector<AppStateI, CreateBudgetStateI>('year')
export const isLoadingSelector = createSelector(createYearFeatureSelector, (budgetStateI: CreateBudgetStateI) => budgetStateI.isSubmitting)
export const errorSelector = createSelector(createYearFeatureSelector, (budgetStateI: CreateBudgetStateI) => budgetStateI.error)
