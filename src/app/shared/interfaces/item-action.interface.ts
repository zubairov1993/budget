import { ItemDataI } from './budget.interface'

export interface CreateItemActionI {
  itemObj: ItemDataI
  yearName: string
  year: number
  monthName: string
  month: number
  dayName: string
  day: number
}

export interface CreateItemSuccessAction {
  year: number
  month: number
  day: number
  itemObj: ItemDataI
}

export interface DeleteItemActionI {
  yearName: string
  year: number
  monthName: string
  month: number
  dayName: string
  day: number
  itemId: string
}
