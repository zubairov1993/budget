import { Component, inject, Injector, OnDestroy, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../auth/services/auth.service'
import { Subscription } from 'rxjs'
import { TuiDialogService, TuiSizeL, TuiSizeS } from '@taiga-ui/core'
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'

import { SharedService } from '../shared/services/shared.service'

import { AddProductDialogComponent } from '../budget/components/add-product-dialog/add-product-dialog.component'

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalMenuComponent implements OnInit, OnDestroy {
  router = inject(Router)
  authService = inject(AuthService)
  sharedService = inject(SharedService)
  dialogs = inject(TuiDialogService)
  injector = inject(Injector)
  cdr = inject(ChangeDetectorRef)

  ngOnInit(): void {
    this.sharedService.currency$.next(localStorage.getItem('currencyBudget') ? localStorage.getItem('currencyBudget')! : 'Рубль')
    const showPrice = JSON.parse(localStorage.getItem('showPriceBudget')!)
    this.sharedService.showPrice$.next(showPrice ? showPrice : false)
    const showPrice$ = this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
    const currency = this.sharedService.currency$.subscribe(() => this.cdr.detectChanges())
    this.allSubscription.push(showPrice, showPrice$, currency)
  }

  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(AddProductDialogComponent, this.injector),
    {
      data: 237,
      dismissible: true,
      label: 'Добавление записи',
    },
  )
  readonly currencies = [ 'Рубль', 'Тенге' ]
  dropdownOpen = false
  size: TuiSizeL | TuiSizeS = 's'
  allSubscription: Subscription[] = []

  onCurrencyChange(currency: string): void {
    localStorage.setItem('currencyBudget', currency)
    this.sharedService.currency$.next(localStorage.getItem('currencyBudget')!)
    setTimeout(() => this.dropdownOpen = false)
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
