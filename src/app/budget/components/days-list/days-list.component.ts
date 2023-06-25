import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'

import { BudgetService } from '../../services/budget.service'
import { SharedService } from '../../../shared/services/shared.service'

import { DayDataI } from '../../../shared/interfaces/budget.interface'

@Component({
  selector: 'app-days-list',
  templateUrl: './days-list.component.html',
  styleUrls: ['./days-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaysListComponent implements OnInit {
  budgetService = inject(BudgetService)
  sharedService = inject(SharedService)
  cdr = inject(ChangeDetectorRef)
  router = inject(Router)

  open = false

  @Input() yearName: string | null = null
  @Input() monthName: string | null = null
  @Input() days: DayDataI[] = []
  @Input() numberOfDays: number = -2

  readonly columns = [ 'name', 'category', 'priceT', 'priceRu', 'other' ]

  constructor() {}

  ngOnInit(): void {
    this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
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

  deleteItem(yearName: string, monthName: string, dayName: string, itemId: string): void {
    this.budgetService.deleteItem(yearName, monthName, dayName, itemId).subscribe(() => this.updateData(), (error: any) => this.errorProcessing(error))
  }

  errorProcessing(error: any): void {
    console.log('error', error)
    if (error.status === 401) this.router.navigate(['/auth'])
  }

  updateData(): void {
    this.sharedService.getData()
  }

  showDialog(): void {
    this.open = true
  }

  close(): void {
    this.open = false
  }
}
