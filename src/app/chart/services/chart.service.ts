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

  getTotalPriceRuByCategoryAndPeriod(category: string, dateFrom: RangeDate, dateTo: RangeDate): number {
    let totalPriceRu = 0;

    for (const year of this.data) {
      if (year.year < dateFrom.year || year.year > dateTo.year) {
        continue;
      }

      for (const month of year.months) {
        if ((month.month < dateFrom.month && year.year === dateFrom.year) ||
            (month.month > dateTo.month && year.year === dateTo.year)) {
          continue;
        }

        for (const day of month.days) {
          if ((year.year > dateFrom.year || month.month > dateFrom.month || day.day >= dateFrom.day) &&
              (year.year < dateTo.year || month.month < dateTo.month || day.day <= dateTo.day)) {
            for (const item of day.items) {
              if (item.category === category) {
                totalPriceRu += item.priceRu;
              }
            }
          }
        }
      }
    }

    return +totalPriceRu.toFixed(2);
  }

  getTotalPriceTByCategoryAndPeriod(category: string, dateFrom: RangeDate, dateTo: RangeDate): number {
    let totalPriceT = 0;

    for (const year of this.data) {
      if (year.year < dateFrom.year || year.year > dateTo.year) {
        continue;
      }

      for (const month of year.months) {
        if ((month.month < dateFrom.month && year.year === dateFrom.year) ||
            (month.month > dateTo.month && year.year === dateTo.year)) {
          continue;
        }

        for (const day of month.days) {
          if ((year.year > dateFrom.year || month.month > dateFrom.month || day.day >= dateFrom.day) &&
              (year.year < dateTo.year || month.month < dateTo.month || day.day <= dateTo.day)) {
            for (const item of day.items) {
              if (item.category === category) {
                totalPriceT += item.priceT;
              }
            }
          }
        }
      }
    }

    return +totalPriceT.toFixed(2);
  }


  // 0

  // getTotalPriceTByCategoryAndPeriod(category: string, dateFrom: RangeDate, dateTo: RangeDate): number {
  //   let totalPriceT = 0

  //   this.data.forEach(year => {
  //     if (year.year >= dateFrom.year && year.year <= dateTo.year) {
  //       year.months.forEach(month => {
  //         if ((month.month >= dateFrom.month) && (month.month <= dateTo.month)) {
  //           month.days.forEach(day => {
  //             if ((day.day >= dateFrom.day) && (day.day <= dateTo.day)) {
  //               day.items.forEach(item => {
  //                 if (item.category === category) totalPriceT += item.priceT
  //               })
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })

  //   return +totalPriceT.toFixed(2)
  // }

  // getTotalPriceRuByCategoryAndPeriod(category: string, dateFrom: RangeDate, dateTo: RangeDate): number {
  //   let totalPriceRu = 0

  //   this.data.forEach(year => {
  //     if (year.year >= dateFrom.year && year.year <= dateTo.year) {
  //       year.months.forEach(month => {
  //         if ((month.month >= dateFrom.month) && (month.month <= dateTo.month)) {
  //           month.days.forEach(day => {
  //             if ((day.day >= dateFrom.day) && (day.day <= dateTo.day)) {
  //               day.items.forEach(item => {
  //                 if (item.category === category) totalPriceRu += item.priceRu
  //               })
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })

  //   return +totalPriceRu.toFixed(2)
  // }
}
