import { NgModule } from '@angular/core'
import { AuthComponent } from './auth.component'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { SharedModule } from '../shared/shared.module'
import { StoreModule } from '@ngrx/store'
import { reducers } from './store/redusers'


@NgModule({
  declarations: [ AuthComponent ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AuthComponent }
    ]),
    StoreModule.forFeature('auth', reducers)
  ],
  exports: [],
  providers: []
})
export class AuthModule { }
