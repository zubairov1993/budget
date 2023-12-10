import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'



import { SharedModule } from '../shared';
import { ChartService } from './services';
import { ChartComponent } from './chart.component';


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
