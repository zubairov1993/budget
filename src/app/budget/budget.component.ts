import { Component, ChangeDetectionStrategy, inject } from '@angular/core'
import { Router } from '@angular/router'
import { BudgetStateI } from '../shared/interfaces/budget.interface';
import { Store } from '@ngrx/store';
import { getBudgetAction } from '../shared/store/actions/get-budget.action';

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
