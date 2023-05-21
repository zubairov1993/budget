import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core'

import { BudgetService } from '../../services/budget.service'

import { IMonthData } from '../../interfaces/budget.interface'


@Component({
  selector: 'app-months-list',
  templateUrl: './months-list.component.html',
  styleUrls: ['./months-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthsListComponent {
  @Input() yearId: string | null = null
  @Input() months: IMonthData[] = []

  constructor(
    public budgetService: BudgetService,
    private cdr: ChangeDetectorRef
  ) {}


  isCurrentMonth(month: number): boolean {
    const currentDate: Date = new Date()
    return month === currentDate.getMonth() + 1
  }

  getMonthNameByIndex(index: number): string {
    const monthNames: string[] = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    return monthNames[index]
  }
}
