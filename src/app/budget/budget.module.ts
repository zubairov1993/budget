import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'

import { SharedModule } from '../shared/shared.module'

import { BudgetService } from './services/budget.service'

import { BudgetComponent } from './budget.component'
import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component'
import { MonthsListComponent } from './components/months-list/months-list.component'
import { DaysListComponent } from './components/days-list/days-list.component';
import { YearsListComponent } from './components/years-list/years-list.component'


@NgModule({
  declarations: [ BudgetComponent, AddProductDialogComponent, MonthsListComponent, DaysListComponent, YearsListComponent ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild([
      { path: '', component: BudgetComponent }
    ]),
  ],
  exports: [],
  providers: [BudgetService],
  bootstrap: []
})
export class BudgetModule {}
