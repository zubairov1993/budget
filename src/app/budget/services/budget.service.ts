import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map, Observable, of } from 'rxjs'
import { Router } from '@angular/router'

import { environment } from 'src/environments/environment'

import { AuthService } from '../../auth/services/auth.service'

import { YearDataI, MonthDataI, DayDataI, ItemDataI } from '../../shared/interfaces/budget.interface'

@Injectable({providedIn: 'root'})
export class BudgetService {
  http = inject(HttpClient)
  router = inject(Router)
  authService = inject(AuthService)

  mykey = '74758fc93d4a03f7a088d0dc'
  rubConverter: number | null = 0.1722

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

  // firebase =================================================================

  createYear(item: YearDataI): Observable<any> {
    const uid = this.authService.localId
    return this.http.post<any>(`${environment.firebaseConfig.databaseURL}/years/${uid}.json`, item)
  }

  createMonth(yearName: string, item: MonthDataI): Observable<any> {
    const uid = this.authService.localId
    return this.http.post<any>(`${environment.firebaseConfig.databaseURL}/years/${uid}/${yearName}/months.json`, item)
  }

  createDay(yearName: string, monthName: string, item: DayDataI): Observable<any> {
    const uid = this.authService.localId
    return this.http.post<any>(`${environment.firebaseConfig.databaseURL}/years/${uid}/${yearName}/months/${monthName}/days.json`, item)
  }

  createItem(yearName: string, monthName: string, dayName: string, item: ItemDataI): Observable<any> {
    const uid = this.authService.localId
    return this.http.post<any>(`${environment.firebaseConfig.databaseURL}/years/${uid}/${yearName}/months/${monthName}/days/${dayName}/items.json`, item)
  }

  deleteItem(yearName: string, monthName: string, dayName: string, itemId: string): Observable<any> {
    const uid = this.authService.localId
    const url = `${environment.firebaseConfig.databaseURL}/years/${uid}/${yearName}/months/${monthName}/days/${dayName}/items/${itemId}.json`
    return this.http.delete(url)
  }

  errorProcessing(error: any): void {
    console.log('error', error)
    if (error.status === 401) this.router.navigate(['/auth'])
  }
}
