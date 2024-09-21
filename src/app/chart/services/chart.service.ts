import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SharedService, YearDataI } from 'src/app/shared';

export interface DateI {
  year: number;
  month: number;
  day: number;
}

interface RangeDate {
  year: number;
  month: number;
  day: number;
}

@Injectable()
export class ChartService {
  private readonly sharedService = inject(SharedService);

  totalsRU$: BehaviorSubject<number[]>;

  constructor() {
    this.totalsRU$ = new BehaviorSubject<number[]>([]);
  }

  changeDate(dateFrom: DateI, dateTo: DateI): void {
    this.totalsRU$.next([]);

    const totalsRU: number[] = [];

    this.sharedService.getBudget().subscribe((data) => {
      if (data?.length !== 0) {
        this.sharedService.categories.forEach((category) => {
          const totalRU = this.getTotalPriceRuByCategoryAndPeriod(
            data!,
            category,
            dateFrom,
            dateTo,
          );
          totalsRU.push(totalRU);
        });

        this.totalsRU$.next(totalsRU);
      }
    });
  }

  getTotalPriceRuByCategoryAndPeriod(
    data: YearDataI[],
    category: string,
    dateFrom: RangeDate,
    dateTo: RangeDate,
  ): number {
    let totalPriceRu = 0;

    if (data) {
      for (const year of data!) {
        if (year.year < dateFrom.year || year.year > dateTo.year) continue;
        for (const month of year.months) {
          if (
            (month.month < dateFrom.month && year.year === dateFrom.year) ||
            (month.month > dateTo.month && year.year === dateTo.year)
          )
            continue;
          for (const day of month.days) {
            if (
              (year.year > dateFrom.year ||
                month.month > dateFrom.month ||
                day.day >= dateFrom.day) &&
              (year.year < dateTo.year ||
                month.month < dateTo.month ||
                day.day <= dateTo.day)
            ) {
              for (const item of day.items) {
                if (item.category === category) totalPriceRu += item.priceRu;
              }
            }
          }
        }
      }
    }

    return +totalPriceRu.toFixed(2);
  }
}
