import { createFeatureSelector, createSelector } from "@ngrx/store"

import { CreateBudgetStateI } from '../interafaces/create-budget.interface'
import { AppStateI } from '../../../../../shared/interfaces/app-state.interface'

export const createMonthFeatureSelector = createFeatureSelector<AppStateI, CreateBudgetStateI>('month')
export const isLoadingSelector = createSelector(createMonthFeatureSelector, (budgetStateI: CreateBudgetStateI) => budgetStateI.isSubmitting)
export const errorSelector = createSelector(createMonthFeatureSelector, (budgetStateI: CreateBudgetStateI) => budgetStateI.error)

