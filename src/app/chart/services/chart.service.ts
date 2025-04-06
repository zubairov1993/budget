import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
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

  totalPrice: Signal<number[]>;

  private readonly dateFrom: WritableSignal<DateI | null>;
  private readonly dateTo: WritableSignal<DateI | null>;

  private get budget(): WritableSignal<YearDataI[] | null> {
    return this.sharedService.budget;
  }

  protected get categories(): WritableSignal<string[]> {
    return this.sharedService.categories;
  }

  constructor() {
    this.totalPrice = computed<number[]>(() => this.getTotalPrice());
    this.dateFrom = signal<DateI | null>(null);
    this.dateTo = signal<DateI | null>(null);
  }

  changeDate(dateFrom: DateI, dateTo: DateI): void {
    this.dateFrom.set(dateFrom);
    this.dateTo.set(dateTo);
  }

  // changeDate(dateFrom: DateI, dateTo: DateI): void {
  //   const totalsRU: number[] = [];

  //   if (!this.budget()) {
  //     return;
  //   }

  //   this.categories().forEach((category) => {
  //     const totalRU = this.getTotalPriceRuByCategoryAndPeriod(
  //       this.budget()!,
  //       category,
  //       dateFrom,
  //       dateTo,
  //     );
  //     totalsRU.push(totalRU);
  //   });

  //   this.totalPrice.set(totalsRU);
  // }

  private getTotalPrice(): number[] {
    if (!this.budget() || !this.dateFrom() || !this.dateTo()) {
      return [];
    }
    const from = this.dateFrom()!;
    const to = this.dateTo()!;

    const totalsRU: number[] = [];
    this.categories().forEach((category) => {
      const totalRU = this.getTotalPriceRuByCategoryAndPeriod(this.budget()!, category, from, to);
      totalsRU.push(totalRU);
    });
    return totalsRU;
  }

  private getTotalPriceRuByCategoryAndPeriod(
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
              (year.year > dateFrom.year || month.month > dateFrom.month || day.day >= dateFrom.day) &&
              (year.year < dateTo.year || month.month < dateTo.month || day.day <= dateTo.day)
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
