import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { switchMap, map, of, filter } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { getBudgetAction, getBudgetSuccessAction, getBudgetFailureAction } from '../actions/get-budget.action'

import { SharedService } from '../../services/shared.service'

import { MonthDataI, YearDataI, DayDataI, ItemDataI } from '../../interfaces/budget.interface'

@Injectable()
export class GetBudgetEffect {
  private actions$ = inject(Actions)
  sharedService = inject(SharedService)
  router = inject(Router)

  getBudget$ = createEffect(() => this.actions$.pipe(
    ofType(getBudgetAction),
    switchMap(() => this.sharedService.getBudget().pipe(
      filter((response: any) => response !== null),
      map((response: any) => {
        return getBudgetSuccessAction({ response: this.parseData(response) })
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        return of(getBudgetFailureAction())
        // return of(loginFailureAction({ errors: errorResponse.error.error.errors }))
      })
    ))
  ))

  parseData(data: {[key: string]: any}): YearDataI[] {
    const result: YearDataI[] = []

    if (data) {
      Object.keys(data).forEach((id) => {
        const year = data[id].year
        const monthsData = data[id].months
        let totalPriceYear = 0

        if (monthsData) {
          const months: MonthDataI[] = Object.keys(monthsData).map((monthName) => {
            const daysData = monthsData[monthName].days
            let totalPriceMonth = 0
            let days: DayDataI[] = []

            if (daysData) {
              days = Object.keys(daysData).map((dayName) => {
                const dayData = daysData[dayName]
                let totalPriceDay = 0
                let items: ItemDataI[] = []

                if (dayData?.items) {
                  items = Object.keys(dayData?.items).map((itemId) => {
                    const itemData = dayData.items[itemId]
                    const item: ItemDataI = {
                      id: itemId,
                      name: itemData.name,
                      category: itemData.category,
                      priceT: itemData.priceT,
                      priceRu: itemData.priceRu,
                    }

                    totalPriceDay += itemData.priceT
                    return item
                  })
                }

                const day: DayDataI = {
                  id: dayName,
                  day: dayData.day,
                  date: dayData.date,
                  totalPriceDay: totalPriceDay,
                  items: items,
                }

                totalPriceMonth += totalPriceDay
                return day
              })
            }

            const month: MonthDataI = {
              id: monthName,
              month: monthsData[monthName].month,
              totalPriceMonth: totalPriceMonth,
              days: days,
              numberOfDays: -2,
            }

            totalPriceYear += totalPriceMonth
            return month

          })

          const resultData: YearDataI = {
            id: id,
            year: year,
            totalPriceYear: totalPriceYear,
            months: months,
            numberOfMonths: -2,
          }
          result.push(resultData)
        }
      })
    }

    return this.sortData(result)
  }

  sortData(data: YearDataI[]): YearDataI[] {
    if (data) {
      data.sort((a, b) => a.year - b.year)
      for (const year of data) {
        year.months.sort((a, b) => a.month - b.month)
        for (const month of year.months) month.days.sort((a, b) => a.day - b.day)
      }
    }
    this.sharedService.popularItems$.next(this.createPopularItemList(data))
    return data
  }

  createPopularItemList(data: YearDataI[]): ItemDataI[] {
    let popularItems: ItemDataI[] = []
    let uniqueItems = new Set<string>()

    for (const year of data) {
      for (const month of year.months) {
        for (const day of month.days) {
          for (const item of day.items) {
            let itemId = `${item.name}-${item.category}`
            if (uniqueItems.has(itemId)) continue
            uniqueItems.add(itemId)
            popularItems.push(item)
          }
        }
      }
    }

    return popularItems
  }
}
