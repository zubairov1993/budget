import { ChangeDetectionStrategy, Component, Inject, OnInit, inject } from '@angular/core'
import { TuiDialogContext } from '@taiga-ui/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus'
import { Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'

import { BudgetService } from '../../services/budget.service'
import { SharedService } from '../../../shared/services/shared.service'

import { createYearAction } from './store/actions/create-year.action'
import { createMonthAction } from './store/actions/create-month.action'
import { createDayAction } from './store/actions/create-day.action'
import { createItemAction } from './store/actions/create-item.action'

import { budgetSelector } from 'src/app/shared/store/selectors'

import { YearDataI, MonthDataI, DayDataI, ItemDataI, BudgetStateI } from '../../../shared/interfaces/budget.interface'

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductDialogComponent implements OnInit {
  router = inject(Router)
  budgetService = inject(BudgetService)
  sharedService = inject(SharedService)
  formBuilder = inject(FormBuilder)
  private store = inject(Store<BudgetStateI>)

  budgets$!: Observable<YearDataI[] | null>
  currentYear: YearDataI| null | undefined = null

  years: YearDataI[] = []
  form: FormGroup = this.formBuilder.group({
    name: [null, [ Validators.required ]],
    category: [null, [ Validators.required ]],
    priceT: [null, [ Validators.required ]],
    priceRu: [null, [ Validators.required ]],
    yesterday: [null],
  })

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<number, number>) {}

  ngOnInit(): void {
    this.sharedService.dataItems$.subscribe((items) => this.years = items)
    const currentDate: Date = new Date()
    const year: number = currentDate.getFullYear()
    this.budgets$ = this.store.pipe(select(budgetSelector))

    this.budgets$.subscribe(budgets => {
      if (budgets && budgets !== undefined) this.currentYear = budgets.find(item => item.year === year)
    });

    this.form.controls['name'].valueChanges.subscribe(data => {
      if (this.getCategory(data)) {
        this.form.controls['category'].setValue(this.getCategory(data).category)
        this.form.controls['priceT'].setValue(this.getCategory(data).priceT)
        this.form.controls['priceRu'].setValue(this.getCategory(data).priceRu)
      }
    })
    this.form.controls['priceT'].valueChanges.subscribe(data => this.form.controls['priceRu'].setValue(this.budgetService.convertToRub(data)))
  }

  getNamesPopular(): string[] {
    return this.sharedService.popularItems$.getValue().map((item) => item.name)
  }

  getCategory(name: string): ItemDataI {
    return this.sharedService.popularItems$.value.filter((item) => item.name === name)[0]
  }

  getItem(): ItemDataI {
    return {
      name: this.form.value.name,
      category: this.form.value.category,
      priceT: this.form.value.priceT,
      priceRu: this.form.value.priceRu
    }
  }

  submit(): void {
    const currentDate: Date = new Date()
    const year: number = currentDate.getFullYear()
    const month: number = currentDate.getMonth() + 1
    let day: number = currentDate.getDate()
    const isYesterday = this.form.value.yesterday
    if (isYesterday) day = day - 1
    let date: Date = new Date()
    if (isYesterday) date.setDate(date.getDate() - 1)

    const isoDate = date.toISOString()

    if (this.currentYear) {
      const currentMonth: MonthDataI = this.currentYear.months.find(item => item.month === month)!
      if (currentMonth) {
        const selectedDay: DayDataI = currentMonth.days.find(item => item.day === day)!
        if (selectedDay) {
          this.createItem(this.currentYear?.id!, currentMonth?.id!, selectedDay?.id!)
        } else {
          this.createDay(this.currentYear?.id!, currentMonth?.id!, day, isoDate)
        }
      } else {
        this.createMonth(this.currentYear?.id!, month, day, isoDate)
      }
    } else {
      this.createYear(year, month, day, isoDate)
    }
  }

  createYear(year: number, month: number, day: number, isoDate: string): void {
    const yearObj = {
      year: year,
      totalPriceYear: null,
      months: [],
    }

    const data = {
      yearObj: yearObj,
      month: month,
      day: day,
      isoDate: isoDate,
      itemObj: this.getItem()
    }

    this.store.dispatch(createYearAction(data))

    // this.budgetService.createYear(yearObj).subscribe(year => {
    //   console.log('response createYear', year)
    //   this.createMonth(year.name, month, day, isoDate)
    // }, (error: any) => this.errorProcessing(error))
  }

  createMonth(yearName: string, month: number, day: number, isoDate: string): void {
    const months = {
      month: month,
      totalPriceMonth: null,
      days: []
    }

    const data = {
      yearName: yearName,
      monthsObj: months,
      day: day,
      isoDate: isoDate,
      itemObj: this.getItem()
    }

    this.store.dispatch(createMonthAction(data))

    // this.budgetService.createMonth(yearName, months).subscribe(month => {
    //   console.log('response createMonth', month)
    //   this.createDay(yearName, month.name, day, isoDate)
    // }, (error: any) => this.errorProcessing(error))
  }

  createDay(yearName: string, monthName: string, day: number, isoDate: string): void {
    const dayObj = {
      day: day,
      date: isoDate,
      totalPriceDay: null,
      items: []
    }

    const data = {
      yearName: yearName,
      monthName: monthName,
      dayObj: dayObj,
      isoDate: isoDate,
      itemObj: this.getItem()
    }
    this.store.dispatch(createDayAction(data))

    // this.budgetService.createDay(yearName, monthName, dayObj).subscribe(day => {
    //   console.log('response createDays', day)
    //   this.createItem(yearName, monthName, day.name)
    // }, (error: any) => this.errorProcessing(error))
  }

  createItem(yearName: string, monthName: string, dayName: string): void {

    const data = {
      itemObj: this.getItem(),
      yearName: yearName,
      monthName: monthName,
      dayName: dayName,
    }
    this.store.dispatch(createItemAction(data))


    // this.budgetService.createItem(yearName, monthName, dayName, this.getItem()).subscribe(item => {
    //   console.log('response createItems', item)
    //   this.context.completeWith(this.form.value)
    // }, (error: any) => this.errorProcessing(error))
  }

  errorProcessing(error: any): void {
    console.log('error', error)
    if (error.status === 401) this.router.navigate(['/auth'])
  }

  clear(): void {
    this.form.reset()
  }
}

