import { Injectable, inject } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { BehaviorSubject } from 'rxjs'

import { budgetSelector } from '../../shared/store/selectors'

import { SharedService } from '../../shared/services/shared.service'

import { BudgetStateI, YearDataI } from '../../shared/interfaces/budget.interface'

export interface DateI {
  year: number
  month: number
  day: number
}

interface RangeDate {
  year: number
  month: number
  day: number
}

@Injectable()

export class ChartService {
  sharedService = inject(SharedService)
  private store = inject(Store<BudgetStateI>)

  totalsKZ$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([])
  totalsRU$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([])

  changeDate(dateFrom: DateI, dateTo: DateI): void {
    this.totalsKZ$.next([])
    this.totalsRU$.next([])

    const totalsKZ: number[] = []
    const totalsRU: number[] = []

    const budgets = this.store.pipe(select(budgetSelector))

    budgets.subscribe(data => {
      if (data?.length !== 0) {
        this.sharedService.catogories.forEach(category => {
          const totalKZ = this.getTotalPriceTByCategoryAndPeriod(data!, category, dateFrom, dateTo)
          const totalRU = this.getTotalPriceRuByCategoryAndPeriod(data!, category, dateFrom, dateTo)
          totalsKZ.push(totalKZ)
          totalsRU.push(totalRU)
        })

        this.totalsKZ$.next(totalsKZ)
        this.totalsRU$.next(totalsRU)
      }
    })
  }

  getTotalPriceRuByCategoryAndPeriod(data: YearDataI[], category: string, dateFrom: RangeDate, dateTo: RangeDate): number {
    let totalPriceRu = 0

    if (data) {
      for (const year of data!) {
        if (year.year < dateFrom.year || year.year > dateTo.year) continue
        for (const month of year.months) {
          if ((month.month < dateFrom.month && year.year === dateFrom.year) || (month.month > dateTo.month && year.year === dateTo.year)) continue
          for (const day of month.days) {
            if ((year.year > dateFrom.year || month.month > dateFrom.month || day.day >= dateFrom.day) && (year.year < dateTo.year || month.month < dateTo.month || day.day <= dateTo.day)) {
              for (const item of day.items) {
                if (item.category === category) totalPriceRu += item.priceRu
              }
            }
          }
        }
      }
    }

    return +totalPriceRu.toFixed(2)
  }

  getTotalPriceTByCategoryAndPeriod(data: YearDataI[], category: string, dateFrom: RangeDate, dateTo: RangeDate): number {
    let totalPriceT = 0

    if (data) {
      for (const year of data) {
        if (year.year < dateFrom.year || year.year > dateTo.year) continue
        for (const month of year.months) {
          if ((month.month < dateFrom.month && year.year === dateFrom.year) || (month.month > dateTo.month && year.year === dateTo.year)) continue
          for (const day of month.days) {
            if ((year.year > dateFrom.year || month.month > dateFrom.month || day.day >= dateFrom.day) && (year.year < dateTo.year || month.month < dateTo.month || day.day <= dateTo.day)) {
              for (const item of day.items) {
                if (item.category === category) totalPriceT += item.priceT
              }
            }
          }
        }
      }
    }

    return +totalPriceT.toFixed(2)
  }
}
