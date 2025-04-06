import { Injectable, OnDestroy, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, finalize, takeUntil } from 'rxjs';

import { environment } from 'src/environments/environment';

import { AuthService } from '../../auth/services/auth.service';
import { DayDataI, ItemDataI, MonthDataI, YearDataI } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class SharedService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  readonly monthlyBudget: WritableSignal<number>;
  readonly popularItems: WritableSignal<ItemDataI[]>;
  readonly categories: WritableSignal<string[]>;
  readonly budget: WritableSignal<YearDataI[] | null>;
  readonly currentYear: Signal<YearDataI | null>;
  readonly currentMonth: Signal<MonthDataI | null>;
  readonly currentDay: Signal<DayDataI | null>;
  readonly budgetLoading: WritableSignal<boolean>;
  private readonly currentYearUid: WritableSignal<string | null>;
  private readonly destroy$: Subject<void>;

  constructor() {
    this.budget = signal<YearDataI[] | null>(null);
    this.currentYear = computed<YearDataI | null>(() => this.getCurrentYear());
    this.currentMonth = computed<MonthDataI | null>(() => this.getCurrentMonth());
    this.currentDay = computed<DayDataI | null>(() => this.getCurrentDay());
    this.monthlyBudget = signal<number>(0);
    this.popularItems = signal<ItemDataI[]>([]);
    this.currentYearUid = signal<string | null>(null);
    this.categories = signal<string[]>([
      'Еда',
      'Автомобиль',
      'Медицинское',
      'Аренда',
      'Детское',
      'Дорога',
      'Вещи',
      'Техника',
      'Учеба',
      'Прочее',
      'Отдых',
    ]);
    this.budgetLoading = signal<boolean>(false);
    this.destroy$ = new Subject<void>();
  }

  private getCurrentYear(): YearDataI | null {
    const budget = this.budget();
    if (!budget) {
      return null;
    }
    const currentYearNumber = new Date().getFullYear();
    return budget.find((year) => year.year === currentYearNumber) || null;
  }

  private getCurrentMonth(): MonthDataI | null {
    const currentYear = this.currentYear();
    if (!currentYear) {
      return null;
    }
    const currentMonthNumber = new Date().getMonth() + 1;
    return currentYear.months.find((month) => month.month === currentMonthNumber) || null;
  }

  private getCurrentDay(): DayDataI | null {
    const currentMonth = this.currentMonth();
    if (!currentMonth) {
      return null;
    }
    const currentDayNumber = new Date().getDate();
    return currentMonth.days.find((day) => day.day === currentDayNumber) || null;
  }

  updateMonthlyBudget(newMonthlyBudget: number, bool: boolean): Observable<any> {
    const value = bool ? this.monthlyBudget() - newMonthlyBudget : newMonthlyBudget;
    this.monthlyBudget.set(value);
    const uid = this.authService.localId;
    const route = `${environment.firebaseConfig.databaseURL}/years/${uid}/${this.currentYearUid()}/monthlyBudget.json`;
    return this.http.put(route, { monthlyBudget: value });
  }

  getBudget(): void {
    this.budgetLoading.set(true);
    const uid = this.authService.localId;
    const path = `${environment.firebaseConfig.databaseURL}/years/${uid}.json`;
    this.http
      .get<any>(path)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.budgetLoading.set(false)),
      )
      .subscribe((data: { [key: string]: any }) => this.budget.set(this.parseData(data)));
  }

  private parseData(data: { [key: string]: any }): YearDataI[] {
    const result: YearDataI[] = [];

    if (data) {
      Object.keys(data).forEach((id) => {
        const year = data[id].year;
        const monthsData = data[id].months;
        let totalPriceYear = 0;

        const currentDate: Date = new Date();
        const currentYear: number = currentDate.getFullYear();
        if (year === currentYear) {
          this.currentYearUid.set(id);
          this.monthlyBudget.set(data[id].monthlyBudget?.monthlyBudget);
        }

        if (monthsData) {
          const months: MonthDataI[] = Object.keys(monthsData).map((monthName) => {
            const daysData = monthsData[monthName].days;
            let totalPriceMonth = 0;
            let days: DayDataI[] = [];

            if (daysData) {
              days = Object.keys(daysData).map((dayName) => {
                const dayData = daysData[dayName];
                let totalPriceDay = 0;
                let items: ItemDataI[] = [];

                if (dayData?.items) {
                  items = Object.keys(dayData?.items).map((itemId) => {
                    const itemData = dayData.items[itemId];
                    const item: ItemDataI = {
                      id: itemId,
                      name: itemData.name,
                      category: itemData.category,
                      priceRu: itemData.priceRu,
                    };

                    totalPriceDay += itemData.priceRu;
                    return item;
                  });
                }

                const day: DayDataI = {
                  id: dayName,
                  day: dayData.day,
                  date: dayData.date,
                  totalPriceDay: totalPriceDay,
                  items: items,
                };

                totalPriceMonth += totalPriceDay;
                return day;
              });
            }

            const month: MonthDataI = {
              id: monthName,
              month: monthsData[monthName].month,
              totalPriceMonth: totalPriceMonth,
              days: days,
            };

            totalPriceYear += totalPriceMonth;
            return month;
          });

          const resultData: YearDataI = {
            id: id,
            year: year,
            totalPriceYear: totalPriceYear,
            months: months,
          };
          result.push(resultData);
        }
      });
    }

    return this.sortData(result);
  }

  private sortData(data: YearDataI[]): YearDataI[] {
    if (data) {
      data.sort((a, b) => a.year - b.year);
      for (const year of data) {
        year.months.sort((a, b) => a.month - b.month);
        for (const month of year.months) month.days.sort((a, b) => a.day - b.day);
      }
    }

    this.createMostPopularItems(data);
    this.popularItems.set(this.createPopularItemList(data));
    return data;
  }

  private createPopularItemList(data: YearDataI[]): ItemDataI[] {
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

  private createMostPopularItems(data: YearDataI[]): ItemDataI[] {
    let itemCounts = new Map<string, { count: number; item: ItemDataI }>();

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
    return sortedItems.map((entry) => entry.item);
  }

  // { "rules": { "years": { "$uid": { ".read": "$uid === auth.uid", ".write": "$uid === auth.uid" } } } }
  // { "rules": { "data": { "$uid": { ".read": "$uid === auth.uid", ".write": "$uid === auth.uid" } } } }

  // getBudget(): Observable<YearEntity> {
  //   const uid = this.authService.localId
  //   const path = `${environment.firebaseConfig.databaseURL}/years/${uid}.json`
  //   console.log('path: ', path);
  //   return this.http.get<YearEntity>(path)
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
