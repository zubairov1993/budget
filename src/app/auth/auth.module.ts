import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'

import { StoreModule } from '@ngrx/store'
import { reducers } from './store/redusers'
import { EffectsModule } from '@ngrx/effects'
import { SharedModule } from '../shared';
import { LoginEffect } from './store';
import { AuthComponent } from './auth.component'


@NgModule({
  declarations: [ AuthComponent ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AuthComponent }
    ]),
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([LoginEffect])
  ],
  exports: [],
  providers: []
})
export class AuthModule { }
