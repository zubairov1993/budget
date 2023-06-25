import { createFeatureSelector, createSelector } from "@ngrx/store"

import { CreateBudgetStateI } from '../interafaces/create-budget.interface'
import { AppStateI } from '../../../../../shared/interfaces/app-state.interface'

export const createItemFeatureSelector = createFeatureSelector<AppStateI, CreateBudgetStateI>('item')
export const isLoadingSelector = createSelector(createItemFeatureSelector, (budgetStateI: CreateBudgetStateI) => budgetStateI.isSubmitting)
export const errorSelector = createSelector(createItemFeatureSelector, (budgetStateI: CreateBudgetStateI) => budgetStateI.error)
