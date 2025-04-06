import { Component, ChangeDetectionStrategy, inject, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';

import { SharedService } from '../shared';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BudgetComponent {
  protected readonly router = inject(Router);
  private readonly sharedService = inject(SharedService);

  protected get budgetLoading(): WritableSignal<boolean> {
    return this.sharedService.budgetLoading;
  }
}
