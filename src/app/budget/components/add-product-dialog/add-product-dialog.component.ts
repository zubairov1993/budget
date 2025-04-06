import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  OnDestroy,
  inject,
  WritableSignal,
  signal,
  Signal,
} from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, map, finalize, takeUntil } from 'rxjs/operators';

import { SharedService } from 'src/app/shared/services/shared.service';
import { DayDataI, ItemDataI, MonthDataI, YearDataI } from 'src/app/shared/interfaces';
import { BudgetService } from '../../services';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AddProductDialogComponent implements OnInit, OnDestroy {
  private readonly sharedService = inject(SharedService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly budgetService = inject(BudgetService);

  protected readonly loading: WritableSignal<boolean>;
  private readonly destroy$: Subject<void>;

  protected readonly form: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required]],
    category: [null, [Validators.required]],
    priceRu: [null, [Validators.required]],
  });

  private get currentYear(): Signal<YearDataI | null> {
    return this.sharedService.currentYear;
  }

  protected get categories(): WritableSignal<string[]> {
    return this.sharedService.categories;
  }

  protected get popularItems(): WritableSignal<ItemDataI[]> {
    return this.sharedService.popularItems;
  }

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<number, number>,
  ) {
    this.loading = signal<boolean>(false);
    this.destroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.form.controls['name'].valueChanges.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      const categoryData = this.getCategory(data);
      if (categoryData) {
        this.form.controls['category'].setValue(categoryData.category);
        this.form.controls['priceRu'].setValue(categoryData.priceRu);
      }
    });
  }

  protected getNamesPopular(): string[] {
    return this.popularItems().map((item) => item.name);
  }

  private getCategory(name: string): ItemDataI | undefined {
    return this.popularItems()
      .slice()
      .reverse()
      .find((item) => item.name === name);
  }

  private getItem(): ItemDataI {
    return {
      id: null as any,
      name: this.form.value.name,
      category: this.form.value.category,
      priceRu: this.form.value.priceRu,
    };
  }

  /**
   * Метод submit теперь становится лаконичным — он просто запускает цепочку:
   * 1. Получаем или создаем год.
   * 2. Получаем или создаем месяц.
   * 3. Получаем или создаем день.
   * 4. Создаем товар.
   */
  protected submit(): void {
    const currentDate = new Date();
    const item = this.getItem();

    this.loading.set(true);

    this.getOrCreateYear(currentDate)
      .pipe(
        switchMap((year) => this.getOrCreateMonth(year!, currentDate)),
        switchMap(([year, month]) => this.getOrCreateDay(year, month, currentDate)),
        switchMap(([year, month, day]) => this.budgetService.createItem(year.id, month.id, day.id, item)),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: () => {
          this.context.completeWith(this.form.value);
          this.sharedService.getBudget();
        },
        error: (error) => console.error('Ошибка при создании данных:', error),
      });
  }

  /**
   * Если текущего года нет, создаем его, иначе возвращаем существующий.
   */
  private getOrCreateYear(date: Date): Observable<YearDataI | null> {
    const yearNumber = date.getFullYear();
    if (!this.currentYear()) {
      return this.budgetService
        .createYear({
          id: '',
          year: yearNumber,
          totalPriceYear: null,
          monthlyBudget: 500,
          months: [],
        })
        .pipe(
          map((yearResponse: { name: string }) => {
            const year: YearDataI = {
              id: yearResponse.name,
              year: yearNumber,
              totalPriceYear: null,
              monthlyBudget: 500,
              months: [],
            };
            return year;
          }),
        );
    } else {
      return of(this.currentYear());
    }
  }

  /**
   * Получаем или создаем месяц для указанного года.
   */
  private getOrCreateMonth(year: YearDataI, date: Date): Observable<[YearDataI, MonthDataI]> {
    const monthNumber = date.getMonth() + 1;
    let month = year.months.find((m) => m.month === monthNumber);
    if (!month) {
      return this.budgetService
        .createMonth(year.id, {
          id: '',
          month: monthNumber,
          totalPriceMonth: null,
          days: [],
        })
        .pipe(
          map((monthResponse: { name: string }) => {
            const newMonth: MonthDataI = {
              id: monthResponse.name,
              month: monthNumber,
              totalPriceMonth: null,
              days: [],
            };
            year.months.push(newMonth);
            return [year, newMonth] as [YearDataI, MonthDataI];
          }),
        );
    } else {
      return of([year, month] as [YearDataI, MonthDataI]);
    }
  }

  /**
   * Получаем или создаем день для указанного месяца.
   */
  private getOrCreateDay(
    year: YearDataI,
    month: MonthDataI,
    date: Date,
  ): Observable<[YearDataI, MonthDataI, DayDataI]> {
    const dayNumber = date.getDate();
    const isoDate = date.toISOString();
    let day = month.days.find((d) => d.day === dayNumber);
    if (!day) {
      return this.budgetService
        .createDay(year.id, month.id, {
          id: '',
          day: dayNumber,
          date: isoDate,
          totalPriceDay: null,
          items: [],
        })
        .pipe(
          map((dayResponse: { name: string }) => {
            const newDay: DayDataI = {
              id: dayResponse.name,
              day: dayNumber,
              date: isoDate,
              totalPriceDay: null,
              items: [],
            };
            month.days.push(newDay);
            return [year, month, newDay] as [YearDataI, MonthDataI, DayDataI];
          }),
        );
    } else {
      return of([year, month, day] as [YearDataI, MonthDataI, DayDataI]);
    }
  }

  protected clear(): void {
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
