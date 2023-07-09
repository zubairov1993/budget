import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, inject } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'

import { SharedService } from '../../../shared/services/shared.service'
import { BudgetService } from '../../services/budget.service'

import { getBudgetAction } from '../../../shared/store/actions/get-budget.action'

import { isLoadingSelector, errorSelector, budgetSelector } from '../../../shared/store/selectors'

import { YearDataI, BudgetStateI } from '../../../shared/interfaces/budget.interface'

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
  private store = inject(Store<BudgetStateI>)

  isLoading$!: Observable<boolean>
  error$!: Observable<string | null>
  budgets$!: Observable<YearDataI[] | null>

  ngOnInit(): void {
    this.store.dispatch(getBudgetAction())
    this.initializeValues()
  }

  initializeValues(): void {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector))
    this.error$ = this.store.pipe(select(errorSelector))
    this.budgets$ = this.store.pipe(select(budgetSelector))
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
}
