import { Component, Injector, OnDestroy, WritableSignal, inject, signal } from '@angular/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { Subject, takeUntil } from 'rxjs';

import { SharedService } from '../shared';
import { ChangeMouthyBudgetDialogComponent } from './components';

@Component({
  selector: 'app-budget-calculator',
  templateUrl: './budget-calculator.component.html',
  styleUrl: './budget-calculator.component.scss',
  standalone: false,
})
export class BudgetCalculatorComponent implements OnDestroy {
  private readonly sharedService = inject(SharedService);
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(Injector);

  protected readonly dailyBudget: WritableSignal<number>;
  private readonly destroy$: Subject<void>;

  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(ChangeMouthyBudgetDialogComponent, this.injector),
    {
      data: 237,
      dismissible: true,
      label: 'Изменение суммы, рассчитанной на месяц',
    },
  );

  protected get monthlyBudget(): WritableSignal<number> {
    return this.sharedService.monthlyBudget;
  }

  constructor() {
    this.dailyBudget = signal<number>(this.monthlyBudget() / this.getRemainingDaysInCurrentMonth());
    this.destroy$ = new Subject<void>();
  }

  private getRemainingDaysInCurrentMonth(): number {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const remainingDays = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return Math.ceil(remainingDays);
  }

  protected onDoubleClick(): void {
    this.dialog.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
