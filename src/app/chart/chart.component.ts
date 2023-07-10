import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, inject, OnDestroy } from '@angular/core'
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk'
import { Subscription } from 'rxjs'

import { SharedService } from '../shared/services/shared.service'
import { ChartService } from './services/chart.service'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit, OnDestroy {
  sharedService = inject(SharedService)
  chartService = inject(ChartService)
  cdr = inject(ChangeDetectorRef)

  date: TuiDayRange | null = null
  firstMonth = TuiMonth.currentLocal().append({ month: -1 })
  middleMonth = TuiMonth.currentLocal()
  hoveredItem: TuiDay | null = null

  activeIndexKZ = NaN
  activeIndexRU = NaN
  allSubscription: Subscription[] = []

  ngOnInit(): void {
    this.forEntirePeriod()
    const showPrice = this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
    const currency = this.sharedService.currency$.subscribe(() => this.cdr.detectChanges())
    this.allSubscription.push(showPrice, currency)
  }

  forEntirePeriod(): void {
    const dateFrom = { year: 2023, month: 5, day: 1 }
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const dateTo = { year, month, day }

    this.date = new TuiDayRange(new TuiDay(2023, 4, 1), new TuiDay(year, month - 1, day))

    this.chartService.changeDate(dateFrom, dateTo)
  }

  onDayClick(day: TuiDay): void {
    if (this.date === null || !this.date.isSingleDay) this.date = new TuiDayRange(day, day)
    this.date = TuiDayRange.sort(this.date.from, day)
    const dateFrom = { year: this.date.from.year, month: this.date.from.month + 1, day: this.date.from.day }
    const dateTo = { year: this.date.to.year, month: this.date.to.month + 1, day: this.date.to.day }
    this.chartService.changeDate(dateFrom, dateTo)
  }

  onMonthChangeFirst(month: TuiMonth): void {
    this.firstMonth = month
    this.middleMonth = month.append({ month: 1 })
  }

  onMonthChangeMiddle(month: TuiMonth): void {
    this.firstMonth = month.append({ month: -1 })
    this.middleMonth = month
  }

  // =================================================================================================

  isItemActiveKZ(index: number): boolean {
    return this.activeIndexKZ === index
  }

  onHoverKZ(index: number, hovered: boolean): void {
    this.activeIndexKZ = hovered ? index : 0
  }

  isItemActiveRU(index: number): boolean {
    return this.activeIndexRU === index
  }

  onHoverRU(index: number, hovered: boolean): void {
    this.activeIndexRU = hovered ? index : 0
  }

  getColor(index: number): string {
    return `var(--tui-chart-${index})`
  }

  sumArrayValues(arr: number[]): number {
    let sum = 0
    for (let i = 0; i < arr.length; i++) sum += arr[i]
    return +sum.toFixed(2)
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach(sub => {
      if (sub) sub.unsubscribe()
    })
  }
}
