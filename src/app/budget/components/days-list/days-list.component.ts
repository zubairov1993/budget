import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  OnDestroy,
  WritableSignal,
  signal,
} from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';

import { DayDataI, ItemDataI, MonthDataI, SharedService } from 'src/app/shared';
import { BudgetService } from '../../services';

@Component({
  selector: 'app-days-list',
  templateUrl: './days-list.component.html',
  styleUrls: ['./days-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DaysListComponent implements OnInit, OnDestroy {
  private readonly budgetService = inject(BudgetService);
  private readonly sharedService = inject(SharedService);

  @Input() monthProps: MonthDataI | null = null;
  @Input() yearName: string | null | undefined = null;
  @Input() year: number | null | undefined = null;

  protected open: boolean;
  protected readonly columns: string[];
  protected readonly days: WritableSignal<DayDataI[]>;
  private readonly selectedItem: WritableSignal<ItemDataI | null>;
  protected readonly loading: WritableSignal<boolean>;
  private readonly destroy$: Subject<void>;

  constructor() {
    this.open = false;
    this.columns = ['name', 'category', 'priceRu', 'other'];
    this.days = signal<DayDataI[]>([]);
    this.selectedItem = signal<ItemDataI | null>(null);
    this.loading = signal<boolean>(false);
    this.destroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.days.set(this.monthProps?.days ? this.monthProps?.days : []);
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

  protected isCurrentDay(day: number): boolean {
    const currentDate: Date = new Date();
    return day === currentDate.getDate();
  }

  protected openDialogDelete(item: ItemDataI) {
    this.open = true;
    this.selectedItem.set(item);
  }

  protected closeDialogDelete() {
    this.open = false;
  }

  protected deleteItem(dayName: string): void {
    this.loading.set(true);
    this.budgetService
      .deleteItem(this.yearName!, this.monthProps?.id!, dayName, this.selectedItem()!.id)
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
