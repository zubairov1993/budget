import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store"

import { AppStateI } from '../../shared/interfaces/app-state.interface'
import { BudgetStateI, YearDataI, MonthDataI, DayDataI } from '../interfaces/budget.interface'

export const budgetFeatureSelector = createFeatureSelector<AppStateI, BudgetStateI>('budget')
export const isLoadingSelector = createSelector(budgetFeatureSelector, (budgetStateI: BudgetStateI) => budgetStateI.isLoading)
export const errorSelector = createSelector(budgetFeatureSelector, (budgetStateI: BudgetStateI) => budgetStateI.error)
export const budgetSelector = createSelector(budgetFeatureSelector, (budgetStateI: BudgetStateI) => budgetStateI.data)

export const yearSelector = (yearId: number): MemoizedSelector<AppStateI, YearDataI | undefined> => createSelector(
  budgetSelector,
  (budget: YearDataI[] | null) => budget?.find(year => year.year === yearId)
)

// export const monthSelector = (yearId: string, monthId: string) => createSelector(
//   yearSelector(yearId),
//   (year: YearDataI | undefined) => year?.months.find(month => month.id === monthId)
// );

// export const daySelector = (yearId: string, monthId: string, dayId: string) => createSelector(
//   monthSelector(yearId, monthId),
//   (month: MonthDataI | undefined) => month?.days.find(day => day.id === dayId)
// );

// export const itemSelector = (yearId: string, monthId: string, dayId: string, itemId: string) => createSelector(
//   daySelector(yearId, monthId, dayId),
//   (day: DayDataI | undefined) => day?.items.find(item => item.id === itemId)
// );
