import { Component, ChangeDetectionStrategy, inject, OnDestroy, Signal, WritableSignal, signal } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';

import { DayDataI, ItemDataI, MonthDataI, SharedService, YearDataI } from 'src/app/shared';
import { BudgetService } from '../../services';

@Component({
  selector: 'app-actual-day',
  templateUrl: './actual-day.component.html',
  styleUrls: ['./actual-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ActualDayComponent implements OnDestroy {
  private readonly budgetService = inject(BudgetService);
  private readonly sharedService = inject(SharedService);

  protected readonly columns: string[];
  protected open: boolean;
  protected readonly loading: WritableSignal<boolean>;
  private readonly selectedItem: WritableSignal<ItemDataI | null>;
  private readonly destroy$: Subject<void>;

  private get currentYear(): Signal<YearDataI | null> {
    return this.sharedService.currentYear;
  }

  private get currentMonth(): Signal<MonthDataI | null> {
    return this.sharedService.currentMonth;
  }

  protected get currentDay(): Signal<DayDataI | null> {
    return this.sharedService.currentDay;
  }

  constructor() {
    this.columns = ['name', 'category', 'priceRu', 'other'];
    this.open = false;
    this.loading = signal<boolean>(false);
    this.selectedItem = signal<ItemDataI | null>(null);
    this.destroy$ = new Subject<void>();
  }

  protected getDayInfo(dateString: string): { dayName: string; dayNumber: number } {
    const date: Date = new Date(dateString);
    const dayNumber: number = date.getDate();
    const dayName: string = this.getDayNameByNumber(date.getDay());
    return { dayName, dayNumber };
  }

  private getDayNameByNumber(dayNumber: number): string {
    dayNumber = dayNumber === 0 ? 7 : dayNumber;
    const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    return daysOfWeek[dayNumber - 1];
  }

  protected openDialogDelete(item: ItemDataI) {
    this.open = true;
    this.selectedItem.set(item);
  }

  protected closeDialogDelete() {
    this.open = false;
  }

  protected deleteItem(): void {
    this.loading.set(true);
    this.budgetService
      .deleteItem(this.currentYear()?.id!, this.currentMonth()?.id!, this.currentDay()?.id!, this.selectedItem()!.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false)),
      )
      .subscribe(() => {
        this.closeDialogDelete();
        this.sharedService.getBudget();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
