import { Injectable } from "@angular/core"
import { HttpClient } from '@angular/common/http'
import { filter, map, BehaviorSubject } from 'rxjs'

import { environment } from "src/environments/environment"

import { IYearData, IMonthData, IDayData, IItemData } from '../../budget/interfaces/budget.interface'

@Injectable({ providedIn: "root" })

export class SharedService {
  showPrice$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  dataItems$: BehaviorSubject<IYearData[]> = new BehaviorSubject<IYearData[]>([])
  popularItems$: BehaviorSubject<IItemData[]> = new BehaviorSubject<IItemData[]>([])
  catogories = [
    'Еда',
    'Вещи',
    'Медицинское',
    'Детское',
    'Техника',
    'Дорога',
    'Аренда',
    'Прочее',
  ]

  constructor(
    private http: HttpClient,
  ) {
  }

  getData() {
    this.http.get(`${environment.firebaseConfig.databaseURL}/years.json`).pipe(
      filter((response: any) => response !== null),
      map((response: any) => this.dataItems$.next(this.parseData(response)))
    ).subscribe()
  }

  parseData(data: {[key: string]: any}): IYearData[] {
    const result: IYearData[] = []

    if (data) {
      Object.keys(data).forEach((id) => {
        const year = data[id].year
        const monthsData = data[id].months
        let totalPriceYear = 0

        if (monthsData) {
          const months: IMonthData[] = Object.keys(monthsData).map((monthId) => {
            const daysData = monthsData[monthId].days
            let totalPriceMonth = 0
            let days: IDayData[] = []

            if (daysData) {
              days = Object.keys(daysData).map((dayId) => {
                const dayData = daysData[dayId]
                let totalPriceDay = 0
                let items: IItemData[] = []

                if (dayData?.items) {
                  items = Object.keys(dayData?.items).map((itemId) => {
                    const itemData = dayData.items[itemId]
                    const item: IItemData = {
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

                const day: IDayData = {
                  id: dayId,
                  day: dayData.day,
                  date: dayData.date,
                  totalPriceDay: totalPriceDay,
                  items: items,
                }

                totalPriceMonth += totalPriceDay
                return day
              })
            }

            const month: IMonthData = {
              id: monthId,
              month: monthsData[monthId].month,
              totalPriceMonth: totalPriceMonth,
              days: days,
            }

            totalPriceYear += totalPriceMonth
            return month

          })

          const resultData: IYearData = {
            id: id,
            year: year,
            totalPriceYear: totalPriceYear,
            months: months,
          }
          result.push(resultData)
        }
      })
    }

    return this.sortData(result)
  }

  sortData(data: IYearData[]): IYearData[] {
    if (data) {
      data.sort((a, b) => a.year - b.year)
      for (const year of data) {
        year.months.sort((a, b) => a.month - b.month)
        for (const month of year.months) month.days.sort((a, b) => a.day - b.day)
      }
    }
    this.popularItems$.next(this.createPopularItemList(data))
    return data
  }

  createPopularItemList(data: IYearData[] ): IItemData[] {
    let popularItems: IItemData[] = []
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
