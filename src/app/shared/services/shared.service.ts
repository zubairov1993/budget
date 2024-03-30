import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, map, of } from 'rxjs';

import { environment } from "src/environments/environment"

import { AuthService } from '../../auth/services/auth.service'

import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DayDataI, ItemDataI, MonthDataI, YearDataI } from '../interfaces';

@Injectable({ providedIn: "root" })

export class SharedService {
  router = inject(Router)
  http = inject(HttpClient)
  authService = inject(AuthService)
  monthlyBudget$: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  currency$: BehaviorSubject<string> = new BehaviorSubject<string>('Тенге')
  showPrice$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  popularItems$: BehaviorSubject<ItemDataI[]> = new BehaviorSubject<ItemDataI[]>([])
  catogories = [
    'Еда',
    'Вещи',
    'Медицинское',
    'Детское',
    'Техника',
    'Дорога',
    'Аренда',
    'Учеба',
    'Прочее',
  ]
  rubConverter: number | null = 0.1722
  currentYearUid: string | null = null

  mykey = '74758fc93d4a03f7a088d0dc'
  private readonly CACHE_KEY = 'exchange_rates'
  private readonly CACHE_LIFETIME = 24 * 60 * 60 * 1000

  constructor() {
    this.getExchangeRates().subscribe(response => {
      const rate = response.conversion_rates['RUB']
      if (response && response.conversion_rates) this.rubConverter = rate ? rate : 0.1722
    }, (error: any) => this.errorProcessing(error))
  }

  getExchangeRates(): Observable<any> {
    const databaseUrl = `https://v6.exchangerate-api.com/v6/${this.mykey}/latest/KZT`
    const cachedRates = localStorage.getItem(this.CACHE_KEY)
    if (cachedRates) {
      const { timestamp, conversion_rates } = JSON.parse(cachedRates)
      if (Date.now() - timestamp < this.CACHE_LIFETIME) {
        return of({ conversion_rates })
      }
    }
    return this.http.get<any>(databaseUrl).pipe(
      map(response => {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          conversion_rates: response.conversion_rates
        }))
        return response
      }),
      catchError(error => {
        console.error('Error fetching exchange rates', error)
        return of(null)
      })
    )
  }

  convertToRub(priceT: number | null): number {
    let price = 0
    if (this.rubConverter && priceT) price = +(priceT * this.rubConverter).toFixed(2)
    return price
  }

  convertToTenge(priceR: number | null): number {
    let price = 0
    if (this.rubConverter && priceR) price = +(priceR / this.rubConverter).toFixed(2)
    return price
  }

  updateMonthlyBudget(newMonthlyBudget: number, bool: boolean): Observable<any> {
    const value = bool ? this.monthlyBudget$.value - newMonthlyBudget : newMonthlyBudget
    this.monthlyBudget$.next(value);
    const uid = this.authService.localId;
    const route = `${environment.firebaseConfig.databaseURL}/years/${uid}/${this.currentYearUid}/monthlyBudget.json`;
    return this.http.put(route, { monthlyBudget: value });
  }

  getBudget(): Observable<any> {
    const uid = this.authService.localId;
    const path = `${environment.firebaseConfig.databaseURL}/years/${uid}.json`
    return this.http.get<any>(path).pipe(
      map((response: any) => {
        return this.parseData(response)
      }),
    )
  }

  parseData(data: {[key: string]: any}): YearDataI[] {
    const result: YearDataI[] = []

    if (data) {
      Object.keys(data).forEach((id) => {
        const year = data[id].year
        const monthsData = data[id].months
        let totalPriceYear = 0

        const currentDate: Date = new Date()
        const currentYear: number = currentDate.getFullYear()
        if (year === currentYear) {
          this.currentYearUid = id
          this.monthlyBudget$.next(data[id].monthlyBudget.monthlyBudget)
        }

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
            }

            totalPriceYear += totalPriceMonth
            return month

          })

          const resultData: YearDataI = {
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

  sortData(data: YearDataI[]): YearDataI[] {
    if (data) {
      data.sort((a, b) => a.year - b.year)
      for (const year of data) {
        year.months.sort((a, b) => a.month - b.month)
        for (const month of year.months) month.days.sort((a, b) => a.day - b.day)
      }
    }

    this.createMostPopularItems(data)
    this.popularItems$.next(this.createPopularItemList(data))
    return data
  }

  createPopularItemList(data: YearDataI[]): ItemDataI[] {
    let itemsMap = new Map<string, ItemDataI>();

    for (const year of data) {
      for (const month of year.months) {
        for (const day of month.days) {
          for (const item of day.items) {
            if (item.name) {
              let itemNameLower = item.name.toLowerCase();
              if (!itemsMap.has(itemNameLower)) {
                itemsMap.set(itemNameLower, item);
              }
            }
          }
        }
      }
    }

    let popularItems = Array.from(itemsMap.values());
    return popularItems;
  }

  createMostPopularItems(data: YearDataI[]): ItemDataI[] {
    let itemCounts = new Map<string, { count: number, item: ItemDataI }>();

    for (const year of data) {
      for (const month of year.months) {
        for (const day of month.days) {
          for (const item of day.items) {
            if (item.name) {
              let itemNameLower = item.name.toLowerCase();
              let currentItem = itemCounts.get(itemNameLower);
              if (currentItem) {
                currentItem.count++;
              } else {
                itemCounts.set(itemNameLower, { count: 1, item: item });
              }
            }
          }
        }
      }
    }

    // Преобразование Map в массив и сортировка по количеству
    let sortedItems = Array.from(itemCounts.values()).sort((a, b) => b.count - a.count);

    // Вывод в консоль для проверки
    // sortedItems.forEach(entry => {
    //   console.log('item: ', entry.item.name, ', count: ', entry.count);
    // });
    // console.log('sortedItems: ', sortedItems);

    // Возвращаем массив объектов ItemDataI самых популярных товаров
    return sortedItems.map(entry => entry.item);
  }


  // { "rules": { "years": { "$uid": { ".read": "$uid === auth.uid", ".write": "$uid === auth.uid" } } } }
  // { "rules": { "data": { "$uid": { ".read": "$uid === auth.uid", ".write": "$uid === auth.uid" } } } }

  // getBudget(): Observable<YearEntity> {
  //   const uid = this.authService.localId
  //   const path = `${environment.firebaseConfig.databaseURL}/years/${uid}.json`
  //   console.log('path: ', path);
  //   return this.http.get<YearEntity>(path)
  // }

  errorProcessing(error: any): void {
    console.log('error', error)
    if (error.status === 401) this.router.navigate(['/auth'])
  }
}
