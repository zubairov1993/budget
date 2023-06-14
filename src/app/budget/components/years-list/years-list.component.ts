import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, inject } from '@angular/core'

import { SharedService } from '../../../shared/services/shared.service'
import { BudgetService } from '../../services/budget.service'

import { YearDataI } from '../../interfaces/budget.interface'

@Component({
  selector: 'app-years-list',
  templateUrl: './years-list.component.html',
  styleUrls: ['./years-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearsListComponent implements OnInit {
  cdr = inject(ChangeDetectorRef)
  sharedService = inject(SharedService)
  budgetService = inject(BudgetService)

  years: YearDataI[] = []

  constructor() { }

  ngOnInit(): void {
    this.updateData()
    this.sharedService.dataItems$.subscribe((items) => {
      this.years = items
      // console.log('this.years', this.years)
      this.years.forEach((year) => {
        year.numberOfMonths = -2
        year.months.forEach((month) => month.numberOfDays = -2)
      })
      this.cdr.detectChanges()
    })

    this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
  }

  changeNumberOfMonths(event: any, year: YearDataI): void {
    event.stopPropagation()
    if (year.numberOfMonths === -year.months.length) year.numberOfMonths = -2
    else year.numberOfMonths = -year.months.length
  }

  isCurrentYear(year: number): boolean {
    const currentDate: Date = new Date()
    return year === currentDate.getFullYear()
  }

  updateData(): void {
    this.sharedService.getData()
  }
}
