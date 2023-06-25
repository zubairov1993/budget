import { createFeatureSelector, createSelector } from "@ngrx/store"

import { CreateBudgetStateI } from '../interafaces/create-budget.interface'
import { AppStateI } from '../../../../../shared/interfaces/app-state.interface'

export const createDayFeatureSelector = createFeatureSelector<AppStateI, CreateBudgetStateI>('day')
export const isLoadingSelector = createSelector(createDayFeatureSelector, (budgetStateI: CreateBudgetStateI) => budgetStateI.isSubmitting)
export const errorSelector = createSelector(createDayFeatureSelector, (budgetStateI: CreateBudgetStateI) => budgetStateI.error)
