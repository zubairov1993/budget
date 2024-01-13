import { Component, ChangeDetectionStrategy, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store';
import { BudgetStateI, getBudgetAction } from '../shared';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetComponent {
  router = inject(Router)
  private store = inject(Store<BudgetStateI>)
  constructor() {
    this.store.dispatch(getBudgetAction())
  }
}
