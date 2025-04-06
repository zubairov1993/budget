import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '../shared';
import {
  ActualDayComponent,
  AddProductDialogComponent,
  DaysListComponent,
  MonthsListComponent,
  YearsListComponent,
} from './components';
import { BudgetComponent } from './budget.component';
import { SearchListComponent } from './components/search-list/search-list.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    BudgetComponent,
    AddProductDialogComponent,
    MonthsListComponent,
    DaysListComponent,
    YearsListComponent,
    ActualDayComponent,
    SearchListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    ScrollingModule,
    RouterModule.forChild([{ path: '', component: BudgetComponent }]),
  ],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class BudgetModule {}
