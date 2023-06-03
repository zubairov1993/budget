export interface IYearData {
  id?: string
  year: number
  totalPriceYear: number | null
  numberOfMonths?: number
  months: IMonthData[]
}

export interface IMonthData {
  id?: string
  month: number
  totalPriceMonth: number | null
  numberOfDays?: number
  days: IDayData[]
}

export interface IDayData {
  id?: string
  day: number
  date: string
  totalPriceDay: number | null
  items: IItemData[]
}

export interface IItemData {
  id?: string
  name: string
  category: string
  priceT: number
  priceRu: number
}
