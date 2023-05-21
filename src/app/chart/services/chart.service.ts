import { Injectable } from "@angular/core"

import { SharedService } from '../../shared/services/shared.service'

import { IYearData } from '../../budget/interfaces/budget.interface'

interface RangeDate {
  year: number
  month: number
  day: number
}

@Injectable()

export class ChartService {
  data: IYearData[] = []

  constructor(public sharedService: SharedService,) {
    this.sharedService.dataItems$.subscribe((items) => this.data = items)
  }

  getTotalPriceTByCategoryAndPeriod(category: string, dateFrom: RangeDate, dateTo: RangeDate): number {
    let totalPriceT = 0

    this.data.forEach(year => {
      if (year.year >= dateFrom.year && year.year <= dateTo.year) {
        year.months.forEach(month => {
          if ((month.month >= dateFrom.month) && (month.month <= dateTo.month)) {
            month.days.forEach(day => {
              if ((day.day >= dateFrom.day) && (day.day <= dateTo.day)) {
                day.items.forEach(item => {
                  if (item.category === category) totalPriceT += item.priceT
                })
              }
            })
          }
        })
      }
    })

    return +totalPriceT.toFixed(2)
  }

  getTotalPriceRuByCategoryAndPeriod(category: string, dateFrom: RangeDate, dateTo: RangeDate): number {
    let totalPriceRu = 0

    this.data.forEach(year => {
      if (year.year >= dateFrom.year && year.year <= dateTo.year) {
        year.months.forEach(month => {
          if ((month.month >= dateFrom.month) && (month.month <= dateTo.month)) {
            month.days.forEach(day => {
              if ((day.day >= dateFrom.day) && (day.day <= dateTo.day)) {
                day.items.forEach(item => {
                  if (item.category === category) totalPriceRu += item.priceRu
                })
              }
            })
          }
        })
      }
    })

    return +totalPriceRu.toFixed(2)
  }
}
