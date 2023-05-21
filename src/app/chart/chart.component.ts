import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core'
import { TuiDay, TuiDayRange, TuiMonth } from '@taiga-ui/cdk'
import { BehaviorSubject } from 'rxjs'

import { SharedService } from '../shared/services/shared.service'
import { ChartService } from './services/chart.service'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit {
  totalsKZ$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([])
  totalsRU$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([])

  date: TuiDayRange | null = null
  firstMonth = TuiMonth.currentLocal()
  middleMonth = TuiMonth.currentLocal().append({ month: 1 })
  lastMonth = TuiMonth.currentLocal().append({ month: 2 })
  hoveredItem: TuiDay | null = null

  activeIndexKZ = NaN
  activeIndexRU = NaN

  constructor(
    public sharedService: SharedService,
    public chartService: ChartService,
    public cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit() {
    this.forEntirePeriod()
  }

  forEntirePeriod() {
    const dateFrom = { year: 2023, month: 5, day: 1 }
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const dateTO = { year, month, day }

    this.date = new TuiDayRange(new TuiDay(2023, 4, 1), new TuiDay(year, month - 1, day))

    this.changeDate(dateFrom, dateTO)
  }

  changeDate(dateFrom: any, dateTo: any) {
    this.totalsKZ$.next([])
    this.totalsRU$.next([])

    const totalsKZ: number[] = []
    const totalsRU: number[] = []

    this.sharedService.dataItems$.subscribe((items) => {
      if (items.length !== 0) {
        this.sharedService.catogories.forEach((category, i) => {
          const totalKZ = this.chartService.getTotalPriceTByCategoryAndPeriod(category, dateFrom, dateTo)
          const totalRU = this.chartService.getTotalPriceRuByCategoryAndPeriod(category, dateFrom, dateTo)
          totalsKZ.push(totalKZ)
          totalsRU.push(totalRU)
        })

        this.totalsKZ$.next(totalsKZ)
        this.totalsRU$.next(totalsRU)
        setTimeout(() => this.cdr.detectChanges(), 1000)
      }
    })
  }

  onDayClick(day: TuiDay) {
    if (this.date === null || !this.date.isSingleDay) this.date = new TuiDayRange(day, day)
    this.date = TuiDayRange.sort(this.date.from, day)
    const dateFrom = { year: this.date.from.year, month: this.date.from.month + 1, day: this.date.from.day }
    const dateTO = { year: this.date.to.year, month: this.date.to.month + 1, day: this.date.to.day }
    this.changeDate(dateFrom, dateTO)
  }

  onMonthChangeFirst(month: TuiMonth) {
    this.firstMonth = month
    this.middleMonth = month.append({ month: 1 })
    this.lastMonth = month.append({ month: 2 })
  }

  onMonthChangeMiddle(month: TuiMonth) {
    this.firstMonth = month.append({ month: -1 })
    this.middleMonth = month
    this.lastMonth = month.append({ month: 1 })
  }

  onMonthChangeLast(month: TuiMonth) {
    this.firstMonth = month.append({ month: -2 })
    this.middleMonth = month.append({ month: -1 })
    this.lastMonth = month
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
}
