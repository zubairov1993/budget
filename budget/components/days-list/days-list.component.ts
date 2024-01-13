import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, inject, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription, Observable } from 'rxjs'
import { select, Store } from '@ngrx/store'

import { isLoadingSelector } from '../../../shared/store/selectors'



import { DeleteItemActionI } from '../../../shared/interfaces/item-action.interface'
import { BudgetStateI, DayDataI, ItemDataI, MonthDataI, SharedService, deleteItem } from 'src/app/shared'

@Component({
  selector: 'app-days-list',
  templateUrl: './days-list.component.html',
  styleUrls: ['./days-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaysListComponent implements OnInit, OnDestroy {
  sharedService = inject(SharedService)
  cdr = inject(ChangeDetectorRef)
  router = inject(Router)
  private store = inject(Store<BudgetStateI>)

  @Input() monthProps: MonthDataI | null = null
  @Input() yearName: string | null | undefined = null
  @Input() year: number | null | undefined = null

  open = false
  days: DayDataI[] = []

  selectedItem: ItemDataI | null | undefined = null
  isLoading$!: Observable<boolean>
  allSubscription: Subscription[] = []

  readonly columns = [ 'name', 'category', 'priceT', 'priceRu', 'other' ]

  ngOnInit(): void {
    this.days = this.monthProps?.days ? this.monthProps?.days : []
    this.isLoading$ = this.store.pipe(select(isLoadingSelector))
    const showPrice = this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
    const currency = this.sharedService.currency$.subscribe(() => this.cdr.detectChanges())
    this.allSubscription.push(showPrice, currency)
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

  openDialogDelete(item: ItemDataI) {
    this.open = true
    this.selectedItem = item
  }

  closeDialogDelete() {
    this.open = false
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

  ngOnDestroy(): void {
    this.allSubscription.forEach(sub => {
      if (sub) sub.unsubscribe()
    })
  }
}
