import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, inject } from '@angular/core';
import { SharedService } from '../shared';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { ChangeMountlyBudgetDialogComponent } from './components';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-budget-calculator',
    templateUrl: './budget-calculator.component.html',
    styleUrl: './budget-calculator.component.scss',
    standalone: false
})
export class BudgetCalculatorComponent implements OnInit, OnDestroy {
  sharedService = inject(SharedService)
  cdr = inject(ChangeDetectorRef)
  dialogs = inject(TuiDialogService)
  injector = inject(Injector)

  monthlyBudget: number = 0;
  daysInMonth: number;
  dailyBudget: number;
  allSubscription: Subscription[] = []

  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(ChangeMountlyBudgetDialogComponent, this.injector),
    {
      data: 237,
      dismissible: true,
      label: 'Изменение суммы, расчитанной на месяц',
    },
  )

  constructor() {
    this.daysInMonth = 0;
    this.dailyBudget = 0;
  }

  ngOnInit(): void {
    this.sharedService.monthlyBudget$.subscribe(count => {
      this.monthlyBudget = count;
      this.daysInMonth = this.getRemainingDaysInCurrentMonth(); // Используем новый метод
      this.dailyBudget = this.monthlyBudget / this.daysInMonth;
      this.cdr.detectChanges();
    });
  }

  private getRemainingDaysInCurrentMonth(): number {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const remainingDays = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return Math.ceil(remainingDays); // Округление в большую сторону, если остаток дня.
  }

  onDoubleClick(): void {
    const dialog = this.dialog.subscribe()
    this.allSubscription.push(dialog)
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach(sub => {
      if (sub) sub.unsubscribe()
    })
  }
}
