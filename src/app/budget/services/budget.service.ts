import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map, Observable, of } from 'rxjs'
import { Router } from '@angular/router'

import { environment } from 'src/environments/environment'

@Injectable()
export class BudgetService {
  mykey = '74758fc93d4a03f7a088d0dc'
  rubConverter: number | null = 0.1722

  private readonly CACHE_KEY = 'exchange_rates'
  private readonly CACHE_LIFETIME = 24 * 60 * 60 * 1000

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
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

  convertToRub(priceT: number | null) {
    let price = 0
    if (this.rubConverter && priceT) price = +(priceT * this.rubConverter).toFixed(2)
    return price
  }

  // firebase =================================================================

  createYear(item: any): Observable<any> {
    return this.http.post<any>(`${environment.firebaseConfig.databaseURL}/years.json`, item)
  }

  createMonths(yearID: string, item: any): Observable<any> {
    return this.http.post<any>(`${environment.firebaseConfig.databaseURL}/years/${yearID}/months.json`, item)
  }

  createDays(yearID: string, monthID: string, item: any): Observable<any> {
    return this.http.post<any>(`${environment.firebaseConfig.databaseURL}/years/${yearID}/months/${monthID}/days.json`, item)
  }

  createItems(yearID: string, monthID: string, dayID: string, item: any): Observable<any> {
    return this.http.post<any>(`${environment.firebaseConfig.databaseURL}/years/${yearID}/months/${monthID}/days/${dayID}/items.json`, item)
  }

  deleteItem(yearID: string, monthID: string, dayID: string, itemId: string): Observable<any> {
    const url = `${environment.firebaseConfig.databaseURL}/years/${yearID}/months/${monthID}/days/${dayID}/items/${itemId}.json`
    return this.http.delete(url)
  }

  errorProcessing(error: any) {
    console.log('error', error)
    if (error.status === 401) this.router.navigate(['/auth'])
  }
}
