import { Component, inject, Injector, OnDestroy, OnInit } from '@angular/core'
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { TuiDialogService } from '@taiga-ui/core'
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { FormControl } from '@angular/forms'

import { SharedService } from './shared/services/shared.service'
import { AuthService } from './auth/services/auth.service'

import { AddProductDialogComponent } from './budget/components/add-product-dialog/add-product-dialog.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  sharedService = inject(SharedService)
  authService = inject(AuthService)
  router = inject(Router)
  dialogs = inject(TuiDialogService)
  injector = inject(Injector)

  currency = new FormControl()
  readonly currencies = [ 'Рубль', 'Тенге' ]
  allSubscription: Subscription[] = []

  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(AddProductDialogComponent, this.injector),
    {
      data: 237,
      dismissible: true,
      label: 'Добавление записи',
    },
  )

  ngOnInit(): void {
    this.currency.setValue(localStorage.getItem('currencyBudget') ? localStorage.getItem('currencyBudget') : 'Рубль')
    this.sharedService.currency$.next(localStorage.getItem('currencyBudget') ? localStorage.getItem('currencyBudget')! : 'Рубль')
    const showPrice = JSON.parse(localStorage.getItem('showPriceBudget')!)
    this.sharedService.showPrice$.next(showPrice ? showPrice : false)
  }

  onCurrencyChange(event: any): void {
    localStorage.setItem('currencyBudget', event)
    this.sharedService.currency$.next(localStorage.getItem('currencyBudget')!)
  }

  showDialog(): void {
    if (this.authService.isAuthenticated()) {
      const dialog = this.dialog.subscribe()
      this.allSubscription.push(dialog)
    } else {
      this.authService.logout()
      this.router.navigate(['/auth'], { queryParams: { authFailed: true } })
    }
  }

  toggleShowPrice(): void {
    localStorage.setItem('showPriceBudget', (!this.sharedService.showPrice$.value).toString())
    this.sharedService.showPrice$.next(!this.sharedService.showPrice$.value)
  }

  ngOnDestroy(): void {
    this.allSubscription.forEach(sub => {
      if (sub) sub.unsubscribe()
    })
  }
}
