import { Component, ChangeDetectionStrategy, Injector, ViewChild, inject, OnDestroy } from '@angular/core'
import { TuiDialogService } from '@taiga-ui/core'
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

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
export class BudgetComponent implements OnDestroy {
  sharedService = inject(SharedService)
  budgetService = inject(BudgetService)
  authService = inject(AuthService)
  router = inject(Router)
  dialogs = inject(TuiDialogService)
  injector = inject(Injector)
  allSubscription: Subscription[] = []

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

  constructor() {}

  showDialog(): void {
    if (this.authService.isAuthenticated()) {
      const dialog = this.dialog.subscribe()
      this.allSubscription.push(dialog)
    } else {
      this.authService.logout()
      this.router.navigate(['/auth'], { queryParams: { authFailed: true } })
    }
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach(sub => {
      if (sub) sub.unsubscribe()
    })
  }
}
