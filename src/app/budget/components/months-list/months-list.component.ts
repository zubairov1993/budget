import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, inject, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'

import { BudgetService } from '../../services/budget.service'
import { SharedService } from '../../../shared/services/shared.service'

import { MonthDataI, YearDataI } from '../../../shared/interfaces/budget.interface'

@Component({
  selector: 'app-months-list',
  templateUrl: './months-list.component.html',
  styleUrls: ['./months-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthsListComponent implements OnInit, OnDestroy {
  budgetService = inject(BudgetService)
  sharedService = inject(SharedService)
  cdr = inject(ChangeDetectorRef)

  @Input() yearProps: YearDataI | null = null
  months: MonthDataI[] = []
  numberOfMonths: number = -2
  allSubscription: Subscription[] = []

  constructor() {}

  ngOnInit(): void {
    this.months = this.yearProps?.months ? this.yearProps?.months : []
    this.numberOfMonths = this.yearProps?.numberOfMonths ? this.yearProps?.numberOfMonths : -2

    const showPrice = this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
    this.allSubscription.push(showPrice)
  }

  changeNumberOfDays(event: any, month: MonthDataI): void {
    event.stopPropagation()
    if (month.numberOfDays === -month.days.length) month.numberOfDays = -2
    else month.numberOfDays = -month.days.length
  }

  isCurrentMonth(month: number): boolean {
    const currentDate: Date = new Date()
    return month === currentDate.getMonth() + 1
  }

  getMonthNameByIndex(index: number): string {
    const monthNames: string[] = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    return monthNames[index]
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach(sub => {
      if (sub) sub.unsubscribe()
    })
  }
}
