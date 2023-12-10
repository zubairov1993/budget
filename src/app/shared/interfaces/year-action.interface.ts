import { ItemDataI, YearDataI } from "./budget.interface"

export interface CreateYearActionI {
  yearObj: YearDataI
  month: number
  day: number
  isoDate: string
  itemObj: ItemDataI
}

export interface CreateYearSuccessActionI {
  yearName: string
  year: number
  month: number
  day: number
  isoDate: string
  itemObj: ItemDataI
}
