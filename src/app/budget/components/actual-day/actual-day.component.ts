import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { select, Store } from '@ngrx/store'

import {
  BudgetStateI,
  DayDataI,
  DeleteItemActionI,
  ItemDataI,
  MonthDataI,
  SharedService,
  YearDataI,
  daySelector,
  deleteItem,
  monthSelector,
  yearSelector
} from 'src/app/shared'

@Component({
  selector: 'app-actual-day',
  templateUrl: './actual-day.component.html',
  styleUrls: ['./actual-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActualDayComponent implements OnInit, OnDestroy {
  private store = inject(Store<BudgetStateI>)
  sharedService = inject(SharedService)
  readonly columns = [ 'name', 'category', 'priceT', 'priceRu', 'other' ]
  cdr = inject(ChangeDetectorRef)
  open = false
  isLoading$!: Observable<boolean>
  currentYear: YearDataI | null | undefined = null
  currentMonth: MonthDataI | null | undefined = null
  currentDay: DayDataI | null | undefined = null
  selectedItem: ItemDataI | null | undefined = null
  allSubscription: Subscription[] = []

  ngOnInit(): void {
    const currentDate: Date = new Date()
    const year: number = currentDate.getFullYear()
    const month: number = currentDate.getMonth() + 1
    const day: number = currentDate.getDate()
    const selectedYearSubscribe = this.store.pipe(select(yearSelector(year))).subscribe(selectedYear => this.currentYear = selectedYear)
    const selectedMonthSubscribe = this.store.pipe(select(monthSelector(year, month))).subscribe(selectedMonth => this.currentMonth = selectedMonth)
    const selectedDaySubscribe = this.store.pipe(select(daySelector(year, month, day))).subscribe(selectedDay => {
      this.currentDay = selectedDay
      this.cdr.detectChanges()
    })
    const showPrice = this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
    const currency = this.sharedService.currency$.subscribe(() => this.cdr.detectChanges())
    this.allSubscription.push(selectedYearSubscribe, selectedMonthSubscribe, selectedDaySubscribe, showPrice, currency)
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

  openDialogDelete(item: ItemDataI) {
    this.open = true
    this.selectedItem = item
  }

  closeDialogDelete() {
    this.open = false
  }

  deleteItem(dayName: string, day: number): void {
    const data: DeleteItemActionI = {
      yearName: this.currentYear?.id!,
      year: this.currentYear?.year!,
      monthName: this.currentMonth?.id!,
      month: this.currentMonth?.month!,
      dayName: dayName,
      day,
      itemId: this.selectedItem!.id
    }

    this.store.dispatch(deleteItem(data))
    setTimeout(() => this.closeDialogDelete(), 1000)
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach(sub => {
      if (sub) sub.unsubscribe()
    })
  }
}
