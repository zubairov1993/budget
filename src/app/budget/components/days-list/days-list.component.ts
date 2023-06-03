import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { BudgetService } from '../../services/budget.service'
import { SharedService } from '../../../shared/services/shared.service'

import { IDayData } from '../../interfaces/budget.interface'

@Component({
  selector: 'app-days-list',
  templateUrl: './days-list.component.html',
  styleUrls: ['./days-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaysListComponent implements OnInit {
  open = false

  @Input() yearId: string | null = null
  @Input() monthId: string | null = null
  @Input() days: IDayData[] = []
  @Input() numberOfDays: number = -2

  readonly columns = [ 'name', 'category', 'priceT', 'priceRu', 'other' ]

  constructor(
    public budgetService: BudgetService,
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
  }

  getDayInfo(dateString: string): { dayName: string, dayNumber: number } {
    const date: Date = new Date(dateString)
    const dayNumber: number = date.getDate()
    const dayName: string = this.getDayNameByNumber(date.getDay())
    return { dayName, dayNumber }
  }

  getDayNameByNumber(dayNumber: number) {
    dayNumber = dayNumber === 0 ? 7 : dayNumber
    const daysOfWeek = [ "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье" ]
    return daysOfWeek[dayNumber - 1]
  }

  isCurrentDay(day: number): boolean {
    const currentDate: Date = new Date()
    return day === currentDate.getDate()
  }

  deleteItem(yearID: string, monthID: string, dayID: string, itemId: string) {
    this.budgetService.deleteItem(yearID, monthID, dayID, itemId).subscribe(() => this.updateData(), (error: any) => this.errorProcessing(error))
  }

  errorProcessing(error: any) {
    console.log('error', error)
    if (error.status === 401) this.router.navigate(['/auth'])
  }

  updateData() {
    this.sharedService.getData()
  }

  showDialog() {
    this.open = true
  }

  close() {
    this.open = false
  }
}
