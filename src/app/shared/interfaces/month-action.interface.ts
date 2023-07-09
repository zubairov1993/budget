import { ItemDataI, MonthDataI } from './budget.interface'

export interface CreateMonthActionI {
  yearName: string
  year: number
  monthsObj: MonthDataI
  month: number
  day: number
  isoDate: string
  itemObj: ItemDataI
}

export interface CreateMonthSuccessActionI {
  yearName: string
  year: number
  monthName: string
  month: number
  day: number
  isoDate: string
  itemObj: ItemDataI
}
