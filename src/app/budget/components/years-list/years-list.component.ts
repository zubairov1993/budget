import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, inject } from '@angular/core'

import { SharedService } from '../../../shared/services/shared.service'
import { BudgetService } from '../../services/budget.service'

import { YearDataI, BudgetStateI } from '../../../shared/interfaces/budget.interface';
import { select, Store } from '@ngrx/store';
import { getBudgetAction } from '../../../shared/store/actions/get-budget.action';
import { isLoadingSelector, errorSelector, budgetSelector } from '../../../shared/store/selectors';
import { Observable } from 'rxjs';

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

  constructor() { }

  ngOnInit(): void {
    // this.updateData()
    // this.sharedService.dataItems$.subscribe((items) => {
    //   // console.log('items', items);
    //   this.years = items
    //   this.years.forEach((year) => {
    //     // year.numberOfMonths = -2
    //     // year.months.forEach((month) => month.numberOfDays = -2)
    //   })
    //   // console.log('this.years', this.years)
    //   this.cdr.detectChanges()
    // })

    // this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())


    this.initializeValues()
    this.fetchData()
  }

  fetchData(): void {
    this.store.dispatch(getBudgetAction())
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

  updateData(): void {
    this.sharedService.getData()
  }
}
