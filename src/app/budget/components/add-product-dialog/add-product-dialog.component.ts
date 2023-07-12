import { ChangeDetectionStrategy, Component, Inject, OnInit, inject, OnDestroy } from '@angular/core'
import { TuiDialogContext } from '@taiga-ui/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus'
import { Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { Observable, Subscription, take } from 'rxjs'
import { Actions, ofType } from '@ngrx/effects'

import { BudgetService } from '../../services/budget.service'
import { SharedService } from '../../../shared/services/shared.service'

import { createYearAction } from '../../../shared/store/actions/create-year.action'
import { createMonthAction } from '../../../shared/store/actions/create-month.action'
import { createDayAction } from '../../../shared/store/actions/create-day.action'
import { createItemAction, createItemSuccessAction } from '../../../shared/store/actions/create-item.action'

import { budgetSelector } from 'src/app/shared/store/selectors'
import { yearSelector } from '../../../shared/store/selectors'

import { YearDataI, MonthDataI, DayDataI, ItemDataI, BudgetStateI } from '../../../shared/interfaces/budget.interface'
import { CreateYearActionI } from '../../../shared/interfaces/year-action.interface'
import { CreateMonthActionI } from '../../../shared/interfaces/month-action.interface'
import { CreateDayActionI } from '../../../shared/interfaces/day-action.interface'
import { CreateItemActionI } from '../../../shared/interfaces/item-action.interface'

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductDialogComponent implements OnInit, OnDestroy {
  router = inject(Router)
  budgetService = inject(BudgetService)
  sharedService = inject(SharedService)
  formBuilder = inject(FormBuilder)
  private store = inject(Store<BudgetStateI>)
  private actions$ = inject(Actions)

  budgets$!: Observable<YearDataI[] | null>
  currentYear: YearDataI| null | undefined = null
  allSubscription: Subscription[] = []

  form: FormGroup = this.formBuilder.group({
    name: [null, [ Validators.required ]],
    category: [null, [ Validators.required ]],
    priceT: [null, [ Validators.required ]],
    priceRu: [null, [ Validators.required ]],
    yesterday: [null],
  })

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<number, number>) {}

  ngOnInit(): void {
    const currentDate: Date = new Date()
    const year: number = currentDate.getFullYear()
    this.budgets$ = this.store.pipe(select(budgetSelector))

    const selectedYearSubscribe = this.store.pipe(select(yearSelector(year))).subscribe(selectedYear => this.currentYear = selectedYear)

    const nameSubscribe = this.form.controls['name'].valueChanges.subscribe(data => {
      if (this.getCategory(data)) {
        this.form.controls['category'].setValue(this.getCategory(data).category)
        this.form.controls['priceT'].setValue(this.getCategory(data).priceT)
        this.form.controls['priceRu'].setValue(this.getCategory(data).priceRu)
      }
    })

    const actions = this.actions$.pipe(ofType(createItemSuccessAction), take(1)).subscribe(() => this.context.completeWith(this.form.value))
    this.allSubscription.push(selectedYearSubscribe, nameSubscribe, actions)
  }

  convertToRub() {
    this.form.controls['priceRu'].setValue(this.budgetService.convertToRub(this.form.controls['priceT'].value))
  }

  convertToTenge() {
    this.form.controls['priceT'].setValue(this.budgetService.convertToTenge(this.form.controls['priceRu'].value))
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
          this.createItem(this.currentYear?.id!, this.currentYear?.year, currentMonth?.id!, currentMonth?.month, selectedDay?.id!, selectedDay.day)
        } else {
          this.createDay(this.currentYear?.id!, this.currentYear?.year, currentMonth?.id!, currentMonth.month, day, isoDate)
        }
      } else {
        this.createMonth(this.currentYear?.id!, year, month, day, isoDate)
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

    const data: CreateYearActionI = {
      yearObj: yearObj,
      month: month,
      day: day,
      isoDate: isoDate,
      itemObj: this.getItem()
    }

    this.store.dispatch(createYearAction(data))
  }

  createMonth(yearName: string, year: number, month: number, day: number, isoDate: string): void {
    const months = {
      month: month,
      totalPriceMonth: null,
      days: []
    }

    const data: CreateMonthActionI = {
      yearName: yearName,
      year: year,
      monthsObj: months,
      month: month,
      day: day,
      isoDate: isoDate,
      itemObj: this.getItem()
    }

    this.store.dispatch(createMonthAction(data))
  }

  createDay(yearName: string, year: number, monthName: string, month: number, day: number, isoDate: string): void {
    const dayObj = {
      day: day,
      date: isoDate,
      totalPriceDay: null,
      items: []
    }

    const data: CreateDayActionI = {
      yearName: yearName,
      year,
      monthName: monthName,
      month,
      dayObj: dayObj,
      isoDate: isoDate,
      itemObj: this.getItem()
    }
    this.store.dispatch(createDayAction(data))
  }

  createItem(yearName: string, year: number, monthName: string, month: number, dayName: string, day: number): void {
    const data: CreateItemActionI = {
      itemObj: this.getItem(),
      yearName: yearName,
      year,
      monthName: monthName,
      month,
      dayName: dayName,
      day
    }
    this.store.dispatch(createItemAction(data))
  }

  errorProcessing(error: any): void {
    console.log('error', error)
    if (error.status === 401) this.router.navigate(['/auth'])
  }

  clear(): void {
    this.form.reset()
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach(sub => {
      if (sub) sub.unsubscribe()
    })
  }
}

