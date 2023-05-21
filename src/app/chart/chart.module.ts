import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'

import { SharedModule } from '../shared/shared.module'

import { ChartComponent } from './chart.component'

import { ChartService } from './services/chart.service'


@NgModule({
  declarations: [ ChartComponent ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild([
      { path: '', component: ChartComponent }
    ]),
  ],
  exports: [],
  providers: [ChartService],
  bootstrap: []
})
export class ChartModule {}
