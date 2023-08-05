import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, inject, OnDestroy } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'

import { SharedService } from '../../../shared/services/shared.service'
import { BudgetService } from '../../services/budget.service'

import { isLoadingSelector, errorSelector, budgetSelector } from '../../../shared/store/selectors'

import { YearDataI, BudgetStateI } from '../../../shared/interfaces/budget.interface'

@Component({
  selector: 'app-years-list',
  templateUrl: './years-list.component.html',
  styleUrls: ['./years-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearsListComponent implements OnInit, OnDestroy {
  cdr = inject(ChangeDetectorRef)
  sharedService = inject(SharedService)
  budgetService = inject(BudgetService)
  private store = inject(Store<BudgetStateI>)

  isLoading$!: Observable<boolean>
  error$!: Observable<string | null>
  budgets$!: Observable<YearDataI[] | null>
  allSubscription: Subscription[] = []

  ngOnInit(): void {
    this.initializeValues()
    const showPrice = this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
    const currency = this.sharedService.currency$.subscribe(() => this.cdr.detectChanges())
    this.allSubscription.push(showPrice, currency)
  }

  initializeValues(): void {
    this.isLoading$ = this.store.pipe(select(isLoadingSelector))
    this.error$ = this.store.pipe(select(errorSelector))
    this.budgets$ = this.store.pipe(select(budgetSelector))
  }

  isCurrentYear(year: number): boolean {
    const currentDate: Date = new Date()
    return year === currentDate.getFullYear()
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach(sub => {
      if (sub) sub.unsubscribe()
    })
  }
}
