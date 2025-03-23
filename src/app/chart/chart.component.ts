import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';
import { Subscription } from 'rxjs';

import { SharedService } from '../shared';
import { ChartService } from './services';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ChartComponent implements OnInit, OnDestroy {
  private readonly sharedService = inject(SharedService);
  private readonly chartService = inject(ChartService);
  private readonly cdr = inject(ChangeDetectorRef);

  date: TuiDayRange | null = null;
  firstMonth = TuiMonth.currentLocal().append({ month: -1 });
  middleMonth = TuiMonth.currentLocal();
  hoveredItem: TuiDay | null = null;

  activeIndexRU = NaN;
  values: number[];
  categories: string[];
  allSubscription: Subscription[] = [];

  constructor() {
    this.values = [];
    this.categories = this.sharedService.categories;
  }

  ngOnInit(): void {
    this.forEntirePeriod();
    this.chartService.totalsRU$.subscribe((v) => {
      this.values = v;
      this.cdr.detectChanges();
    });
  }

  forEntirePeriod(): void {
    const dateFrom = { year: 2023, month: 5, day: 1 };
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const dateTo = { year, month, day };

    this.date = new TuiDayRange(
      new TuiDay(2023, 4, 1),
      new TuiDay(year, month - 1, day),
    );

    this.chartService.changeDate(dateFrom, dateTo);
    this.cdr.detectChanges();
  }

  onDayClick(day: TuiDay): void {
    if (this.date === null || !this.date.isSingleDay)
      this.date = new TuiDayRange(day, day);
    this.date = TuiDayRange.sort(this.date.from, day);
    const dateFrom = {
      year: this.date.from.year,
      month: this.date.from.month + 1,
      day: this.date.from.day,
    };
    const dateTo = {
      year: this.date.to.year,
      month: this.date.to.month + 1,
      day: this.date.to.day,
    };
    this.chartService.changeDate(dateFrom, dateTo);
  }

  onMonthChangeFirst(month: TuiMonth): void {
    this.firstMonth = month;
    this.middleMonth = month.append({ month: 1 });
  }

  onMonthChangeMiddle(month: TuiMonth): void {
    this.firstMonth = month.append({ month: -1 });
    this.middleMonth = month;
  }

  // =================================================================================================

  isItemActiveRU(index: number): boolean {
    return this.activeIndexRU === index;
  }

  onHoverRU(index: number, hovered: boolean): void {
    this.activeIndexRU = hovered ? index : 0;
  }

  getColor(index: number): string {
    return `var(--tui-chart-${index})`;
  }

  sumArrayValues(arr: number[]): number {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i];
    return +sum.toFixed(2);
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
