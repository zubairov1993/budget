import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { select, Store } from '@ngrx/store'

import { deleteItem } from 'src/app/shared/store/actions/delete-item.action'

import { yearSelector, monthSelector, daySelector } from '../../../shared/store/selectors'

import { BudgetService } from '../../services/budget.service'
import { SharedService } from '../../../shared/services/shared.service'

import { DeleteItemActionI } from '../../../shared/interfaces/item-action.interface'
import { DayDataI, BudgetStateI, YearDataI, MonthDataI, ItemDataI } from '../../../shared/interfaces/budget.interface'

@Component({
  selector: 'app-actual-day',
  templateUrl: './actual-day.component.html',
  styleUrls: ['./actual-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActualDayComponent implements OnInit, OnDestroy {
  private store = inject(Store<BudgetStateI>)
  budgetService = inject(BudgetService)
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

  deleteItem(dayName: string, day: number, itemId: string): void {
    const data: DeleteItemActionI = {
      yearName: this.currentYear?.id!,
      year: this.currentYear?.year!,
      monthName: this.currentMonth?.id!,
      month: this.currentMonth?.month!,
      dayName: dayName,
      day,
      itemId
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
