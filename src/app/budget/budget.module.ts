import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { ActionReducerMap, combineReducers, StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'

import { SharedModule } from '../shared/shared.module'

import { BudgetService } from './services/budget.service'

import { BudgetComponent } from './budget.component'
import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component'
import { MonthsListComponent } from './components/months-list/months-list.component'
import { DaysListComponent } from './components/days-list/days-list.component'
import { YearsListComponent } from './components/years-list/years-list.component'

import { yearReducer } from './components/add-product-dialog/store/reducers/create-year.reducer'
import { monthReducer } from './components/add-product-dialog/store/reducers/create-month.reducer'
import { dayReducer } from './components/add-product-dialog/store/reducers/create-day.reducer'
import { itemReducer } from './components/add-product-dialog/store/reducers/create-item.reducer'

import { CreateYearEffect } from './components/add-product-dialog/store/effects/create-year.effect'
import { CreateMonthEffect } from './components/add-product-dialog/store/effects/create-month.effect'
import { CreateDayEffect } from './components/add-product-dialog/store/effects/create-day.effect'
import { CreateItemEffect } from './components/add-product-dialog/store/effects/create-item.effect'

export const reducers: ActionReducerMap<any> = {
  year: yearReducer,
  month: monthReducer,
  day: dayReducer,
  item: itemReducer,
};

export const combinedReducers = combineReducers(reducers);

@NgModule({
  declarations: [ BudgetComponent, AddProductDialogComponent, MonthsListComponent, DaysListComponent, YearsListComponent ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild([
      { path: '', component: BudgetComponent }
    ]),
    EffectsModule.forFeature([CreateYearEffect, CreateMonthEffect, CreateDayEffect, CreateItemEffect]),
    StoreModule.forFeature('feature', reducers),
  ],
  exports: [],
  providers: [BudgetService],
  bootstrap: []
})
export class BudgetModule {}
