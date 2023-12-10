import { Component, inject, Injector, OnDestroy, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { TuiDialogService } from '@taiga-ui/core'
import { Subscription } from 'rxjs';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { AddProductDialogComponent } from '../budget/components/add-product-dialog/add-product-dialog.component';
import { SharedService } from '../shared';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavMenuComponent implements OnInit, OnDestroy  {
  router = inject(Router)
  authService = inject(AuthService)
  sharedService = inject(SharedService)
  dialogs = inject(TuiDialogService)
  injector = inject(Injector)
  cdr = inject(ChangeDetectorRef)
  renderer = inject(Renderer2)
  allSubscription: Subscription[] = []

  ngOnInit(): void {
    this.sharedService.currency$.next(localStorage.getItem('currencyBudget') ? localStorage.getItem('currencyBudget')! : 'Рубль')
    const showPrice = JSON.parse(localStorage.getItem('showPriceBudget')!)
    this.sharedService.showPrice$.next(showPrice ? showPrice : false)
    const showPrice$ = this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
    const currency = this.sharedService.currency$.subscribe(() => this.cdr.detectChanges())
    this.allSubscription.push(showPrice$, currency)
  }

  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(AddProductDialogComponent, this.injector),
    {
      data: 237,
      dismissible: true,
      label: 'Добавление записи',
    },
  )

  onCurrencyChange(currency: string): void {
    const changedCurrency = currency === 'Рубль' ? 'Тенге' : 'Рубль'
    localStorage.setItem('currencyBudget', changedCurrency)
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
