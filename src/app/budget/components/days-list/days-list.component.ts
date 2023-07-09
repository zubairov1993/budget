import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, inject, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { Store } from '@ngrx/store'

import { deleteItem } from 'src/app/shared/store/actions/delete-item.action'

import { BudgetService } from '../../services/budget.service'
import { SharedService } from '../../../shared/services/shared.service'

import { DayDataI, MonthDataI, BudgetStateI } from '../../../shared/interfaces/budget.interface'
import { DeleteItemActionI } from '../../../shared/interfaces/item-action.interface'

@Component({
  selector: 'app-days-list',
  templateUrl: './days-list.component.html',
  styleUrls: ['./days-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaysListComponent implements OnInit, OnDestroy {
  budgetService = inject(BudgetService)
  sharedService = inject(SharedService)
  cdr = inject(ChangeDetectorRef)
  router = inject(Router)
  private store = inject(Store<BudgetStateI>)

  open = false
  @Input() monthProps: MonthDataI | null = null

  @Input() yearName: string | null | undefined = null
  @Input() year: number | null | undefined = null
  month: number | null = null
  days: DayDataI[] = []
  numberOfDays: number = -2

  allSubscription: Subscription[] = []

  readonly columns = [ 'name', 'category', 'priceT', 'priceRu', 'other' ]

  constructor() {}

  ngOnInit(): void {
    this.days = this.monthProps?.days ? this.monthProps?.days : []
    this.month = this.monthProps?.month ? this.monthProps?.month : null
    this.numberOfDays = this.monthProps?.numberOfDays ? this.monthProps?.numberOfDays : -2

    const showPrice = this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
    this.allSubscription.push(showPrice)
  }

  getDayInfo(dateString: string): { dayName: string, dayNumber: number } {
    const date: Date = new Date(dateString)
    const dayNumber: number = date.getDate()
    const dayName: string = this.getDayNameByNumber(date.getDay())
    return { dayName, dayNumber }
  }

  getDayNameByNumber(dayNumber: number): string {
    dayNumber = dayNumber === 0 ? 7 : dayNumber
    const daysOfWeek = [ "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье" ]
    return daysOfWeek[dayNumber - 1]
  }

  isCurrentDay(day: number): boolean {
    const currentDate: Date = new Date()
    return day === currentDate.getDate()
  }

  deleteItem(dayName: string, day: number, itemId: string): void {

    const data: DeleteItemActionI = {
      yearName: this.yearName!,
      year: this.year!,
      monthName: this.monthProps?.id!,
      month: this.monthProps?.month!,
      dayName: dayName,
      day,
      itemId
    }

    this.store.dispatch(deleteItem(data))
  }

  errorProcessing(error: any): void {
    console.log('error', error)
    if (error.status === 401) this.router.navigate(['/auth'])
  }

  showDialog(): void {
    this.open = true
  }

  close(): void {
    this.open = false
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach(sub => {
      if (sub) sub.unsubscribe()
    })
  }
}
