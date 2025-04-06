import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  inject,
  WritableSignal,
  Signal,
  signal,
} from '@angular/core';
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk';

import { SharedService } from '../shared';
import { ChartService } from './services';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ChartComponent implements OnInit {
  private readonly sharedService = inject(SharedService);
  private readonly chartService = inject(ChartService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly date: WritableSignal<TuiDayRange | null>;
  protected readonly firstMonth: WritableSignal<TuiMonth>;
  protected readonly middleMonth: WritableSignal<TuiMonth>;
  protected hoveredItem: TuiDay | null;
  protected activeIndexRU: number;

  protected get totalPrice(): Signal<number[]> {
    return this.chartService.totalPrice;
  }

  protected get categories(): WritableSignal<string[]> {
    return this.sharedService.categories;
  }

  constructor() {
    this.date = signal<TuiDayRange | null>(null);
    this.firstMonth = signal<TuiMonth>(TuiMonth.currentLocal().append({ month: -1 }));
    this.middleMonth = signal<TuiMonth>(TuiMonth.currentLocal());
    this.hoveredItem = null;
    this.activeIndexRU = NaN;
  }

  ngOnInit(): void {
    this.forEntirePeriod();
  }

  private forEntirePeriod(): void {
    const dateFrom = { year: 2023, month: 5, day: 1 };
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const dateTo = { year, month, day };

    this.date.set(new TuiDayRange(new TuiDay(2023, 4, 1), new TuiDay(year, month - 1, day)));

    this.chartService.changeDate(dateFrom, dateTo);
    this.cdr.detectChanges();
  }

  protected onDayClick(day: TuiDay): void {
    if (this.date() === null || !this.date()!.isSingleDay) {
      this.date.set(new TuiDayRange(day, day));
    }
    this.date.set(TuiDayRange.sort(this.date()!.from, day));
    const dateFrom = {
      year: this.date()!.from.year,
      month: this.date()!.from.month + 1,
      day: this.date()!.from.day,
    };
    const dateTo = {
      year: this.date()!.to.year,
      month: this.date()!.to.month + 1,
      day: this.date()!.to.day,
    };
    this.chartService.changeDate(dateFrom, dateTo);
  }

  protected onMonthChangeFirst(month: TuiMonth): void {
    this.firstMonth.set(month);
    this.middleMonth.set(month.append({ month: 1 }));
  }

  protected onMonthChangeMiddle(month: TuiMonth): void {
    this.firstMonth.set(month.append({ month: -1 }));
    this.middleMonth.set(month);
  }

  // =================================================================================================

  protected isItemActiveRU(index: number): boolean {
    return this.activeIndexRU === index;
  }

  protected onHoverRU(index: number, hovered: boolean): void {
    this.activeIndexRU = hovered ? index : 0;
  }

  protected getColor(index: number): string {
    return `var(--tui-chart-categorical-0${index})`;
  }

  protected sumArrayValues(arr: number[]): number {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i];
    return +sum.toFixed(2);
  }
}
