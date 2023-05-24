import { Component, ChangeDetectionStrategy, Inject, Injector, ChangeDetectorRef, OnInit } from '@angular/core'
import { TuiDialogService } from '@taiga-ui/core'
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus'
import { Router } from '@angular/router'

import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component'

import { SharedService } from '../shared/services/shared.service'
import { BudgetService } from './services/budget.service'
import { AuthService } from '../auth/services/auth.service'

import { IYearData } from './interfaces/budget.interface'


@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BudgetComponent implements OnInit {
  years: IYearData[] = []
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
    public budgetService: BudgetService,
    public sharedService: SharedService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.updateData()
    this.sharedService.dataItems$.subscribe((items) => {
      this.years = items
      console.log('this.years', this.years)
      this.cdr.detectChanges()
    })

    this.sharedService.showPrice$.subscribe(() => this.cdr.detectChanges())
  }

  showDialog() {
    if (this.authService.isAuthenticated()) {
      this.dialog.subscribe({
        next: () => this.updateData(),
      })
    } else {
      this.authService.logout()
      this.router.navigate(['/auth'], { queryParams: { authFailed: true } })
    }
  }

  isCurrentYear(year: number): boolean {
    const currentDate: Date = new Date()
    return year === currentDate.getFullYear()
  }

  updateData() {
    this.sharedService.getData()
  }
}
