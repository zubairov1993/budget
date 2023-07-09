import { BudgetStateI } from '../interfaces/budget.interface'
import { Action, createReducer, on } from '@ngrx/store'

import { getBudgetAction, getBudgetSuccessAction, getBudgetFailureAction } from './actions/get-budget.action'
import { createItemSuccessAction } from './actions/create-item.action'
import { createYearSuccessAction } from './actions/create-year.action'
import { createMonthSuccessAction } from './actions/create-month.action'
import { createDaySuccessAction } from './actions/create-day.action'
import { deleteItemSuccessAction } from './actions/delete-item.action'

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
  on(getBudgetSuccessAction, (state, action): BudgetStateI => {
    return {
      ...state,
      isLoading: false,
      data: action.response
    }
  }),
  on(createYearSuccessAction, (state, action): BudgetStateI => {
    let newState: BudgetStateI = JSON.parse(JSON.stringify(state))
    if (newState.data === null) newState.data = []
    newState.data.push({ year: action.year, totalPriceYear: null, months: [] })
    return {
      ...newState,
      isLoading: false
    }
  }),
  on(createMonthSuccessAction, (state, action): BudgetStateI => {
    let newState: BudgetStateI = JSON.parse(JSON.stringify(state))
    if (newState.data === null) newState.data = []
    const yearIndex = newState.data.findIndex(year => year.year === action.year)
    newState.data[yearIndex].months.push({ month: action.month, totalPriceMonth: null, days: [] })
    return {
      ...newState,
      isLoading: false
    }
  }),
  on(createDaySuccessAction, (state, action): BudgetStateI => {
    let newState: BudgetStateI = JSON.parse(JSON.stringify(state))
    if (newState.data === null) newState.data = []
    const yearIndex = newState.data.findIndex(year => year.year === action.year)
    const monthIndex = newState.data[yearIndex].months.findIndex(month => month.month === action.month)
    newState.data[yearIndex].months[monthIndex].days.push({ day: action.day, totalPriceDay: null, date: action.isoDate, items: [] })
    return {
      ...newState,
      isLoading: false
    }
  }),
  on(createItemSuccessAction, (state, action): BudgetStateI => {
    let newState: BudgetStateI = JSON.parse(JSON.stringify(state))
    if (newState.data === null) newState.data = []
    const yearIndex = newState.data.findIndex(year => year.year === action.year)
    const monthIndex = newState.data[yearIndex].months.findIndex(month => month.month === action.month)
    const dayIndex = newState.data[yearIndex].months[monthIndex].days.findIndex(day => day.day === action.day)
    newState.data[yearIndex].months[monthIndex].days[dayIndex].items.push(action.itemObj)
    return {
      ...newState,
      isLoading: false
    }
  }),
  on(deleteItemSuccessAction, (state, action) => {
    let newState: BudgetStateI = JSON.parse(JSON.stringify(state))
    if (newState.data === null) newState.data = []
    const yearIndex = newState.data.findIndex(year => year.year === action.year)
    const monthIndex = newState.data[yearIndex].months.findIndex(month => month.month === action.month)
    const dayIndex = newState.data[yearIndex].months[monthIndex].days.findIndex(day => day.day === action.day)
    let items = newState.data[yearIndex].months[monthIndex].days[dayIndex].items
    items = items.filter(item => item.id !== action.itemId)
    newState.data[yearIndex].months[monthIndex].days[dayIndex].items = items
    return {
      ...newState,
      isLoading: false
    }
  }),
  on(getBudgetFailureAction, (state): BudgetStateI => ({
    ...state,
    isLoading: false,
  }))
)

export function reducers(state: BudgetStateI, action: Action) {
  return budgetReducer(state, action)
}
