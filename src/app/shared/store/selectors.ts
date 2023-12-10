import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store"

import { AppStateI, BudgetStateI, MonthDataI, YearDataI } from "../interfaces"

export const budgetFeatureSelector = createFeatureSelector<AppStateI, BudgetStateI>('budget')
export const isLoadingSelector = createSelector(budgetFeatureSelector, (budgetStateI: BudgetStateI) => budgetStateI.isLoading)
export const errorSelector = createSelector(budgetFeatureSelector, (budgetStateI: BudgetStateI) => budgetStateI.error)
export const budgetSelector = createSelector(budgetFeatureSelector, (budgetStateI: BudgetStateI) => budgetStateI.data)

export const yearSelector = (yearNum: number): MemoizedSelector<AppStateI, YearDataI | undefined> => createSelector(
  budgetSelector,
  (budget: YearDataI[] | null) => budget?.find(year => year.year === yearNum)
)

export const monthSelector = (yearNum: number, monthNum: number) => createSelector(
  yearSelector(yearNum),
  (year: YearDataI | undefined) => year?.months.find(month => month.month === monthNum)
)

export const daySelector = (yearNum: number, monthNum: number, dayNum: number) => createSelector(
  monthSelector(yearNum, monthNum),
  (month: MonthDataI | undefined) => month?.days.find(day => day.day === dayNum)
)

// export const itemSelector = (yearId: string, monthId: string, dayId: string, itemId: string) => createSelector(
//   daySelector(yearId, monthId, dayId),
//   (day: DayDataI | undefined) => day?.items.find(item => item.id === itemId)
// );
