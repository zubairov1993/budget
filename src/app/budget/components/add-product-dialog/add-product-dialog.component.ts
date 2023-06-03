import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { TuiDialogContext } from '@taiga-ui/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus'
import { Router } from '@angular/router'

import { BudgetService } from '../../services/budget.service'
import { SharedService } from '../../../shared/services/shared.service'

import { IYearData, IMonthData, IDayData, IItemData } from '../../interfaces/budget.interface'

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductDialogComponent implements OnInit {
  years: IYearData[] = []
  form: FormGroup = this.formBuilder.group({
    name: [null, [ Validators.required ]],
    category: [null, [ Validators.required ]],
    priceT: [null, [ Validators.required ]],
    priceRu: [null, [ Validators.required ]],
    yesterday: [null],
  })

  constructor(
    public budgetService: BudgetService,
    public sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<number, number>,
  ) {

    this.form.controls['name'].valueChanges.subscribe(data => {
      if (this.getCategory(data)) {
        this.form.controls['category'].setValue(this.getCategory(data).category)
        this.form.controls['priceT'].setValue(this.getCategory(data).priceT)
        this.form.controls['priceRu'].setValue(this.getCategory(data).priceRu)
      }
    })
    this.form.controls['priceT'].valueChanges.subscribe(data => this.form.controls['priceRu'].setValue(this.budgetService.convertToRub(data)))
  }

  ngOnInit() {
    this.sharedService.dataItems$.subscribe((items) => this.years = items)
  }

  getNamesPopular(): string[] {
    return this.sharedService.popularItems$.getValue().map((item) => item.name)
  }

  getCategory(name: string): IItemData {
    return this.sharedService.popularItems$.value.filter((item) => item.name === name)[0]
  }

  submit() {
    const currentDate: Date = new Date()
    const year: number = currentDate.getFullYear()
    const month: number = currentDate.getMonth() + 1
    let day: number = currentDate.getDate()
    const isYesterday = this.form.value.yesterday
    if (isYesterday) day = day - 1
    let date: Date
    if (isYesterday) {
      date = new Date()
      date.setDate(date.getDate() - 1)
    } else {
      date = new Date()
    }
    const isoDate = date.toISOString()
    const currentYear: IYearData = this.years.find(item => item.year === year)!
    if (currentYear) {
      const currentMonth: IMonthData = currentYear.months.find(item => item.month === month)!
      if (currentMonth) {
        const selectedDay: IDayData = currentMonth.days.find(item => item.day === day)!
        if (selectedDay) {
          this.createItem(currentYear?.id!, currentMonth?.id!, selectedDay?.id!)
        } else {
          this.createDay(currentYear?.id!, currentMonth?.id!, day, isoDate)
        }
      } else {
        this.createMonth(currentYear?.id!, month, day, isoDate)
      }
    } else {
      this.createYear(year, month, day, isoDate)
    }
  }

  createYear(year:number, month: number, day: number, isoDate: string) {
    const data = {
      year: year,
      totalPriceYear: null,
      months: []
    }

    this.budgetService.createYear(data).subscribe(year => {
      console.log('response createYear', year)
      this.createMonth(year.name, month, day, isoDate)
    }, (error: any) => this.errorProcessing(error))

  }

  createMonth(yearId: string, month: number, day: number, isoDate: string) {
    const months = {
      month: month,
      totalPriceMonth: null,
      days: []
    }

    this.budgetService.createMonths(yearId, months).subscribe(month => {
      console.log('response createMonth', month)
      this.createDay(yearId, month.name, day, isoDate)
    }, (error: any) => this.errorProcessing(error))
  }

  createDay(yearId: string, monthId: string, day: number, isoDate: string) {
    const days = {
      day: day,
      date: isoDate,
      totalPriceDay: null,
      items: []
    }

    this.budgetService.createDays(yearId, monthId, days).subscribe(day => {
      console.log('response createDays', day)
      this.createItem(yearId, monthId, day.name)
    }, (error: any) => this.errorProcessing(error))
  }

  createItem(yearId: string, monthId: string, dayId: string) {
    const item = {
      name: this.form.value.name,
      category: this.form.value.category,
      priceT: this.form.value.priceT,
      priceRu: this.form.value.priceRu
    }

    this.budgetService.createItems(yearId, monthId, dayId, item).subscribe(item => {
      console.log('response createItems', item)
      this.context.completeWith(this.form.value)
    }, (error: any) => this.errorProcessing(error))
  }

  errorProcessing(error: any) {
    console.log('error', error)
    if (error.status === 401) this.router.navigate(['/auth'])
  }

  clear() {
    this.form.reset()
  }
}

