import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
  OnDestroy,
} from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, take } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

import {
  BudgetStateI,
  CreateDayActionI,
  CreateItemActionI,
  CreateMonthActionI,
  CreateYearActionI,
  DayDataI,
  ItemDataI,
  MonthDataI,
  SharedService,
  YearDataI,
  budgetSelector,
  createDayAction,
  createItemAction,
  createItemSuccessAction,
  createMonthAction,
  createYearAction,
  isLoadingSelector,
  yearSelector,
} from 'src/app/shared';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductDialogComponent implements OnInit, OnDestroy {
  router = inject(Router);
  sharedService = inject(SharedService);
  formBuilder = inject(FormBuilder);
  private store = inject(Store<BudgetStateI>);
  private actions$ = inject(Actions);

  budgets$!: Observable<YearDataI[] | null>;
  currentYear: YearDataI | null | undefined = null;
  isLoading$!: Observable<boolean>;
  allSubscription: Subscription[] = [];

  form: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required]],
    category: [null, [Validators.required]],
    priceRu: [null, [Validators.required]],
  });

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<number, number>,
  ) {}

  ngOnInit(): void {
    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    this.budgets$ = this.store.pipe(select(budgetSelector));
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));

    const selectedYearSubscribe = this.store
      .pipe(select(yearSelector(year)))
      .subscribe((selectedYear) => (this.currentYear = selectedYear));

    this.form.controls['name'].valueChanges.subscribe((data) => {
      if (this.getCategory(data)) {
        this.form.controls['category'].setValue(
          this.getCategory(data).category,
        );
        this.form.controls['priceRu'].setValue(this.getCategory(data).priceRu);
      }
    });

    const actions = this.actions$
      .pipe(ofType(createItemSuccessAction), take(1))
      .subscribe(() => this.context.completeWith(this.form.value));

    this.allSubscription.push(selectedYearSubscribe, actions);
  }

  getNamesPopular(): string[] {
    return this.sharedService.popularItems$.getValue().map((item) => item.name);
  }

  getCategory(name: string): ItemDataI {
    return this.sharedService.popularItems$.value.filter(
      (item) => item.name === name,
    )[0];
  }

  getItem(): ItemDataI {
    return {
      id: null as any,
      name: this.form.value.name,
      category: this.form.value.category,
      priceRu: this.form.value.priceRu,
    };
  }

  submit(): void {
    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1;
    let day: number = currentDate.getDate();
    let date: Date = new Date();
    const isoDate = date.toISOString();

    if (this.currentYear) {
      const currentMonth: MonthDataI = this.currentYear.months.find(
        (item) => item.month === month,
      )!;
      if (currentMonth) {
        const selectedDay: DayDataI = currentMonth.days.find(
          (item) => item.day === day,
        )!;
        if (selectedDay) {
          this.createItem(
            this.currentYear?.id!,
            this.currentYear?.year,
            currentMonth?.id!,
            currentMonth?.month,
            selectedDay?.id!,
            selectedDay.day,
          );
        } else {
          this.createDay(
            this.currentYear?.id!,
            this.currentYear?.year,
            currentMonth?.id!,
            currentMonth.month,
            day,
            isoDate,
          );
        }
      } else {
        this.createMonth(this.currentYear?.id!, year, month, day, isoDate);
      }
    } else {
      this.createYear(year, month, day, isoDate);
    }
  }

  createYear(year: number, month: number, day: number, isoDate: string): void {
    const yearObj = {
      id: null as any,
      year: year,
      totalPriceYear: null,
      monthlyBudget: 500,
      months: [],
    };

    const data: CreateYearActionI = {
      yearObj: yearObj,
      month: month,
      day: day,
      isoDate: isoDate,
      itemObj: this.getItem(),
    };

    this.store.dispatch(createYearAction(data));
  }

  createMonth(
    yearName: string,
    year: number,
    month: number,
    day: number,
    isoDate: string,
  ): void {
    const months = {
      id: null as any,
      month: month,
      totalPriceMonth: null,
      days: [],
    };

    const data: CreateMonthActionI = {
      yearName: yearName,
      year: year,
      monthsObj: months,
      month: month,
      day: day,
      isoDate: isoDate,
      itemObj: this.getItem(),
    };

    this.store.dispatch(createMonthAction(data));
  }

  createDay(
    yearName: string,
    year: number,
    monthName: string,
    month: number,
    day: number,
    isoDate: string,
  ): void {
    const dayObj = {
      id: null as any,
      day: day,
      date: isoDate,
      totalPriceDay: null,
      items: [],
    };

    const data: CreateDayActionI = {
      yearName: yearName,
      year,
      monthName: monthName,
      month,
      dayObj: dayObj,
      isoDate: isoDate,
      itemObj: this.getItem(),
    };
    this.store.dispatch(createDayAction(data));
  }

  createItem(
    yearName: string,
    year: number,
    monthName: string,
    month: number,
    dayName: string,
    day: number,
  ): void {
    const data: CreateItemActionI = {
      itemObj: this.getItem(),
      yearName: yearName,
      year,
      monthName: monthName,
      month,
      dayName: dayName,
      day,
    };
    this.store.dispatch(createItemAction(data));
  }

  clear(): void {
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}
