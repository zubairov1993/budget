import { Component, ChangeDetectionStrategy, Inject, Injector, ViewChild, inject, OnInit } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core'
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { Router } from '@angular/router'
import { select, Store } from '@ngrx/store';

import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component'
import { YearsListComponent } from './components/years-list/years-list.component'

import { SharedService } from '../shared/services/shared.service'
import { BudgetService } from './services/budget.service'
import { AuthService } from '../auth/services/auth.service'

import { YearDataI } from '../shared/interfaces/budget.interface'


@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetComponent {
  sharedService = inject(SharedService)
  budgetService = inject(BudgetService)
  authService = inject(AuthService)
  router = inject(Router)

  @ViewChild('YearsListComponent') yearsListComponent!: YearsListComponent

  years: YearDataI[] = []
  rubConverter: number | null = null

  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(AddProductDialogComponent, this.injector),
    {
      data: 237,
      dismissible: true,
      label: 'Добавление записи',
    },
  )

  constructor(
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector,
  ) {}

  showDialog(): void {
    if (this.authService.isAuthenticated()) {
      this.dialog.subscribe({
        next: () => this.yearsListComponent.updateData(),
      })
    } else {
      this.authService.logout()
      this.router.navigate(['/auth'], { queryParams: { authFailed: true } })
    }
  }
}
