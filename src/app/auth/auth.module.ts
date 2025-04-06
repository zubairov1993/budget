import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared';
import { AuthComponent } from './auth.component';

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild([{ path: '', component: AuthComponent }])],
  exports: [],
  providers: [],
})
export class AuthModule {}
