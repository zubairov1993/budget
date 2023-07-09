import { ItemDataI, DayDataI } from './budget.interface'

export interface CreateDayActionI {
  yearName: string
  year: number
  monthName: string
  month: number
  dayObj: DayDataI
  isoDate: string
  itemObj: ItemDataI
}

export interface CreateDaySuccessActionI {
  yearName: string
  year: number
  monthName: string
  month: number
  dayName: string
  day: number
  isoDate: string
  itemObj: ItemDataI
}
