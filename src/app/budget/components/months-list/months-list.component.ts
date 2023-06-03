import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core'

import { BudgetService } from '../../services/budget.service'
import { SharedService } from '../../../shared/services/shared.service'

import { IMonthData } from '../../interfaces/budget.interface'


@Component({
  selector: 'app-months-list',
  templateUrl: './months-list.component.html',
  styleUrls: ['./months-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthsListComponent implements OnInit {
  @Input() yearId: string | null = null
  @Input() months: IMonthData[] = []
  @Input() numberOfMonths: number = -2

  constructor(
    public budgetService: BudgetService,
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
  }

  changeNumberOfDays(event: any, month: IMonthData) {
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
}
