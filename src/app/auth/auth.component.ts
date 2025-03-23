import { Component, ChangeDetectionStrategy, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { select, Store } from '@ngrx/store'

import { Observable } from 'rxjs'

import { loginAction } from './store/actions/login.action'

import { isSubmittingSelector } from './store/selectors'

import { UserI } from './interfaces/auth.interface'
import { AppStateI } from '../shared'

@Component({
    selector: 'app-login',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AuthComponent {
  formBuilder = inject(FormBuilder)
  private store = inject(Store<AppStateI>)

  isSubmitting$: Observable<boolean>

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  constructor() {
    this.isSubmitting$ = this.store.pipe(select(isSubmittingSelector))
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return
    const user: UserI = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      returnSecureToken: true
    }
    this.store.dispatch(loginAction({ request: user }))
  }
}
