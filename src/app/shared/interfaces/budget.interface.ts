export interface BudgetStateI {
  isLoading: boolean
  error: string | null
  data: YearDataI[] | null
}

export interface YearDataI {
  id?: string
  year: number
  totalPriceYear: number | null
  numberOfMonths?: number | null
  months: MonthDataI[]
}

export interface MonthDataI {
  id?: string
  month: number
  totalPriceMonth: number | null
  numberOfDays?: number | null
  days: DayDataI[]
}

export interface DayDataI {
  id?: string
  day: number
  date: string
  totalPriceDay: number | null
  items: ItemDataI[]
}

export interface ItemDataI {
  id?: string
  name: string
  category: string
  priceT: number
  priceRu: number
}
